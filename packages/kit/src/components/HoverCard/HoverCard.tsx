import "@codeui/styles/theme.css";
import "@codeui/styles/hovercard.css";
import { hoverCardParts, type HoverCardClasses } from "@codeui/styles/hovercard";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { callHandler, isPointInPolygon, type Polygon } from "@kobalte/utils";
import {
	Popover as KPopover,
	usePopoverContext,
	type PopoverAnchorProps as KPopoverAnchorProps,
	type PopoverContentProps as KPopoverContentProps,
	type PopoverRootOptions as KPopoverRootOptions,
} from "@kobalte/core/popover";
import {
	createContext,
	createEffect,
	createSignal,
	onCleanup,
	omit,
	Show,
	untrack,
	useContext,
	type ParentProps,
} from "solid-js";
import { isServer, type JSX, type ValidComponent } from "@solidjs/web";
import { mergeClasses } from "../../utils/css";
import { HydratablePortal } from "../../utils/hydratable-portal";
import { LayerScope } from "../../utils/layer-scope";
import { createPopMotion, motionRef, PopMotionContext } from "../../utils/pop-motion";
import * as styles from "./HoverCard.css";

export {
	hoverCardParts,
	hoverCardStyles,
	type HoverCardPart,
	type HoverCardClasses,
	type HoverCardStyles,
} from "@codeui/styles/hovercard";

export type HoverCardProps = Omit<
	KPopoverRootOptions,
	"modal" | "preventScroll" | "anchorRef" | "translations"
> & {
	/** Time in ms from when the pointer enters or the trigger gets focus until the card opens. Defaults to 500. */
	openDelay?: number;
	/** Time in ms from when the pointer leaves the trigger and the card until it closes. Defaults to 150. */
	closeDelay?: number;
	/** Close as soon as the pointer leaves, even on its way from the trigger to the card. */
	ignoreSafeArea?: boolean;
};

type HoverCardController = {
	open: () => void;
	openNow: () => void;
	isOpen: () => boolean;
	close: () => void;
	cancelOpen: () => void;
	cancelClose: () => void;
	setTrigger: (element: HTMLElement) => void;
	setContent: (element: HTMLElement) => void;
	contains: (target: EventTarget | null) => boolean;
};

const HoverCardContext = createContext<HoverCardController>();

function useHoverCard() {
	const context = useContext(HoverCardContext);
	if (!context) throw new Error("[codeui]: HoverCard parts must be used within a `HoverCard`");
	return context;
}

/**
 * Kobalte alpha.5's HoverCard root adds its pointer listener inside an effect
 * callback, which Solid 2 rejects as soon as the card opens. The card is built
 * on Kobalte's Popover instead: Popper places it and its dismissable layer
 * handles Escape and outside presses. The hover and focus timers below follow
 * Kobalte's HoverCard. Return to `@kobalte/core/hover-card` once it registers
 * the listener from an effect cleanup.
 */
export function HoverCard(props: ParentProps<HoverCardProps>) {
	const others = omit(
		props,
		"open",
		"defaultOpen",
		"onOpenChange",
		"forceMount",
		"openDelay",
		"closeDelay",
		"ignoreSafeArea",
	);
	const [requested, setRequested] = createSignal(untrack(() => props.defaultOpen ?? false));
	const isOpen = () => props.open ?? requested();
	const motion = createPopMotion({
		get open() {
			return isOpen();
		},
		get forceMount() {
			return props.forceMount;
		},
		onOpenChange(next: boolean) {
			setRequested(next);
			props.onOpenChange?.(next);
		},
	});
	const [trigger, setTrigger] = createSignal<HTMLElement>();
	const [content, setContent] = createSignal<HTMLElement>();
	let openTimer: ReturnType<typeof setTimeout> | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	const cancelOpen = () => {
		clearTimeout(openTimer);
		openTimer = undefined;
	};
	const cancelClose = () => {
		clearTimeout(closeTimer);
		closeTimer = undefined;
	};
	const setOpen = (next: boolean) => {
		cancelOpen();
		cancelClose();
		if (next !== isOpen()) motion.onOpenChange(next);
	};
	const contains = (target: EventTarget | null) =>
		target instanceof Node &&
		Boolean(trigger()?.contains(target) || content()?.contains(target));

	const controller: HoverCardController = {
		open() {
			cancelClose();
			if (isOpen() || openTimer) return;
			openTimer = setTimeout(() => setOpen(true), props.openDelay ?? 500);
		},
		openNow() {
			if (!isOpen()) setOpen(true);
			else cancelClose();
		},
		isOpen,
		close() {
			cancelOpen();
			if (!isOpen() || closeTimer) return;
			closeTimer = setTimeout(() => setOpen(false), props.closeDelay ?? 150);
		},
		cancelOpen,
		cancelClose,
		setTrigger,
		setContent,
		contains,
	};

	createEffect(
		() => (isOpen() ? { trigger: trigger(), content: content() } : undefined),
		elements => {
			if (isServer || !elements) return;
			const onPointerMove = (event: PointerEvent) => {
				if (event.pointerType === "touch") return;
				if (contains(event.target)) return cancelClose();
				const { trigger, content } = elements;
				if (
					!props.ignoreSafeArea &&
					trigger &&
					content &&
					isPointInPolygon([event.clientX, event.clientY], safeArea(trigger, content))
				)
					return cancelClose();
				controller.close();
			};
			document.addEventListener("pointermove", onPointerMove, true);
			return () => document.removeEventListener("pointermove", onPointerMove, true);
		},
	);
	onCleanup(() => {
		cancelOpen();
		cancelClose();
	});

	return (
		<HoverCardContext value={controller}>
			<PopMotionContext value={motion.setTarget}>
				<KPopover
					{...others}
					open={isOpen()}
					onOpenChange={setOpen}
					forceMount={motion.forceMount()}
					placement={props.placement ?? "right-start"}
					gutter={props.gutter ?? 6}
				/>
			</PopMotionContext>
		</HoverCardContext>
	);
}

export type HoverCardTriggerProps<T extends ValidComponent = "a"> = KPopoverAnchorProps<T> & {
	class?: string;
	onPointerEnter?: JSX.EventHandlerUnion<HTMLElement, PointerEvent>;
	onPointerLeave?: JSX.EventHandlerUnion<HTMLElement, PointerEvent>;
	onFocus?: JSX.EventHandlerUnion<HTMLElement, FocusEvent>;
	onBlur?: JSX.EventHandlerUnion<HTMLElement, FocusEvent>;
	onPointerDown?: JSX.EventHandlerUnion<HTMLElement, PointerEvent>;
	onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
};

type TriggerEvent<E extends Event> = E & { currentTarget: HTMLElement; target: Element };

/**
 * The element that opens the card on hover, on keyboard focus and on click. Renders an `a`:
 * give it an `href`, or render another focusable element with `as`. On a touch screen the
 * first tap on a closed card opens it instead of following the link; the next tap follows it.
 */
export function HoverCardTrigger<T extends ValidComponent = "a">(
	props: PolymorphicProps<T, HoverCardTriggerProps<T>>,
) {
	const local = props as PolymorphicProps<"a", HoverCardTriggerProps>;
	const others = omit(
		local,
		"class",
		"ref",
		"onPointerEnter",
		"onPointerLeave",
		"onFocus",
		"onBlur",
		"onPointerDown",
		"onClick",
	);
	const card = useHoverCard();
	let pointerType = "";
	return (
		<KPopover.Anchor
			as="a"
			{...others}
			ref={[card.setTrigger, local.ref]}
			onPointerEnter={(event: TriggerEvent<PointerEvent>) => {
				callHandler(event, local.onPointerEnter);
				if (event.pointerType !== "touch" && !event.defaultPrevented) card.open();
			}}
			onPointerLeave={(event: TriggerEvent<PointerEvent>) => {
				callHandler(event, local.onPointerLeave);
				if (event.pointerType !== "touch") card.cancelOpen();
			}}
			onPointerDown={(event: TriggerEvent<PointerEvent>) => {
				callHandler(event, local.onPointerDown);
				pointerType = event.pointerType;
			}}
			onClick={(event: TriggerEvent<MouseEvent>) => {
				callHandler(event, local.onClick);
				const touch = pointerType === "touch" || pointerType === "pen";
				pointerType = "";
				if (event.defaultPrevented) return;
				if (touch && !card.isOpen() && event.currentTarget.hasAttribute("href"))
					event.preventDefault();
				card.openNow();
			}}
			onFocus={(event: TriggerEvent<FocusEvent>) => {
				callHandler(event, local.onFocus);
				if (!event.defaultPrevented) card.open();
			}}
			onBlur={(event: TriggerEvent<FocusEvent>) => {
				callHandler(event, local.onBlur);
				if (!card.contains(event.relatedTarget)) card.close();
			}}
			data-cui={hoverCardParts.trigger}
			class={mergeClasses(local.class)}
		/>
	);
}

export type HoverCardContentProps<T extends ValidComponent = "div"> = Omit<
	KPopoverContentProps<T>,
	"onOpenAutoFocus" | "onCloseAutoFocus"
> & {
	class?: string;
	/** Node the card is portaled into. Defaults to `document.body`. */
	mount?: globalThis.Element;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: Pick<HoverCardClasses, "content">;
};

type PointerDownOutsideEvent = Parameters<
	NonNullable<KPopoverContentProps["onPointerDownOutside"]>
>[0];

/** The card. Portaled, placed beside the trigger (on the right unless there is no room), and never takes focus. */
export function HoverCardContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, HoverCardContentProps<T>>,
) {
	const local = props as PolymorphicProps<"div", HoverCardContentProps>;
	const others = omit(local, "class", "classes", "mount", "ref", "onPointerDownOutside");
	const popover = usePopoverContext();
	const card = useHoverCard();
	return (
		<Show when={popover.contentPresent()}>
			<HydratablePortal mount={local.mount}>
				<LayerScope>
					<KPopover.Content
						role={undefined}
						{...others}
						ref={[motionRef({ hover: true }), card.setContent, local.ref]}
						onPointerDownOutside={(event: PointerDownOutsideEvent) => {
							local.onPointerDownOutside?.(event);
							// A press on the trigger is a click that keeps the card open.
							if (card.contains(event.target)) event.preventDefault();
						}}
						data-cui={hoverCardParts.content}
						class={mergeClasses(styles.content(), local.classes?.content, local.class)}
					/>
				</LayerScope>
			</HydratablePortal>
		</Show>
	);
}

/** The region the pointer may cross from the trigger to the card without closing it, after Kobalte's HoverCard. */
function safeArea(trigger: HTMLElement, content: HTMLElement): Polygon {
	const a = trigger.getBoundingClientRect();
	const f = content.getBoundingClientRect();
	const centerX = a.left + a.width / 2;
	const centerY = a.top + a.height / 2;
	if (f.left >= a.right)
		return [[centerX, a.top], [f.left, f.top], [f.right, f.top], [f.right, f.bottom], [f.left, f.bottom], [centerX, a.bottom]];
	if (f.right <= a.left)
		return [[centerX, a.top], [f.right, f.top], [f.left, f.top], [f.left, f.bottom], [f.right, f.bottom], [centerX, a.bottom]];
	if (f.top >= a.bottom)
		return [[a.left, centerY], [f.left, f.top], [f.left, f.bottom], [f.right, f.bottom], [f.right, f.top], [a.right, centerY]];
	return [[a.left, centerY], [f.left, f.bottom], [f.left, f.top], [f.right, f.top], [f.right, f.bottom], [a.right, centerY]];
}

export type HoverCardListProps = JSX.HTMLAttributes<HTMLUListElement> & {
	/** Names the list for assistive technology, for example "Subtasks". */
	"aria-label"?: string;
};

/**
 * A list of entries inside a hover card. It caps near 24rem and scrolls on its own,
 * so the card keeps its size however many entries it holds.
 */
export function HoverCardList(props: HoverCardListProps) {
	const others = omit(props, "class");
	return (
		<ul
			tabindex={0}
			{...others}
			data-cui={hoverCardParts.list}
			class={mergeClasses(styles.list(), props.class)}
		/>
	);
}

export type HoverCardItemProps = Omit<JSX.HTMLAttributes<HTMLLIElement>, "children"> & {
	/** State icon, 16px. The slot stays empty without it, so entries align. A finished entry shows no icon. */
	icon?: JSX.Element;
	/** Names the state the icon shows, such as "Running". Without it the icon is decorative. */
	iconLabel?: string;
	/** Short identifier, such as `#142` or `T-3`. Shown before the title in secondary text. */
	identifier?: JSX.Element;
	/** Nesting level, from 0. Each level indents the entry by `--cui-hovercard-item-indent`. */
	depth?: number;
	/** The title. It stays on one line and truncates. */
	children?: JSX.Element;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: Pick<HoverCardClasses, "item" | "itemIcon" | "itemId" | "itemTitle">;
};

/** One line in a `HoverCardList`: state icon, identifier, then the title truncated. */
export function HoverCardItem(props: HoverCardItemProps) {
	const others = omit(
		props,
		"class",
		"classes",
		"icon",
		"iconLabel",
		"identifier",
		"depth",
		"children",
		"style",
	);
	return (
		<li
			{...others}
			data-cui={hoverCardParts.item}
			class={mergeClasses(styles.item(), props.classes?.item, props.class)}
			style={{
				...(typeof props.style === "object" ? props.style : {}),
				...(props.depth ? { "--cui-hovercard-item-depth": String(props.depth) } : {}),
			}}
		>
			<span
				role={props.iconLabel ? "img" : undefined}
				aria-label={props.iconLabel}
				aria-hidden={props.iconLabel ? undefined : "true"}
				data-cui={hoverCardParts.itemIcon}
				class={mergeClasses(styles.itemIcon(), props.classes?.itemIcon)}
			>
				{props.icon}
			</span>
			<Show when={props.identifier}>
				<span
					data-cui={hoverCardParts.itemId}
					class={mergeClasses(styles.itemId(), props.classes?.itemId)}
				>
					{props.identifier}
				</span>
			</Show>
			<span
				data-cui={hoverCardParts.itemTitle}
				class={mergeClasses(styles.itemTitle(), props.classes?.itemTitle)}
			>
				{props.children}
			</span>
		</li>
	);
}
