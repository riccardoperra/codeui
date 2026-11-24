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
};

type TriggerEvent<E extends Event> = E & { currentTarget: HTMLElement; target: Element };

/**
 * The element that opens the card on hover and on keyboard focus. Renders an `a`:
 * give it an `href`, or render another focusable element with `as`.
 */
export function HoverCardTrigger<T extends ValidComponent = "a">(
	props: PolymorphicProps<T, HoverCardTriggerProps<T>>,
) {
	const local = props as PolymorphicProps<"a", HoverCardTriggerProps>;
	const others = omit(local, "class", "ref", "onPointerEnter", "onPointerLeave", "onFocus", "onBlur");
	const card = useHoverCard();
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

/** The card. Portaled, positioned next to the trigger, and never takes focus. */
export function HoverCardContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, HoverCardContentProps<T>>,
) {
	const local = props as PolymorphicProps<"div", HoverCardContentProps>;
	const others = omit(local, "class", "classes", "mount", "ref");
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
