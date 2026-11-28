import "@codeui/styles/theme.css";
import "@codeui/styles/hovercard.css";
import { hoverCardParts, type HoverCardClasses } from "@codeui/styles/hovercard";
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import { callHandler, isPointInPolygon } from "@kobalte/utils";
import type {
	PopoverAnchorProps as KPopoverAnchorProps,
	PopoverRootOptions as KPopoverRootOptions,
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
import { isServer, Portal, type JSX, type ValidComponent } from "@solidjs/web";
import { mergeClasses } from "../../utils/css";
import * as styles from "./HoverCard.css";
import {
	createHoverCardHost,
	HoverCardHostProvider,
	HoverCardSurface,
	withinPortal,
	type HoverCardHost,
	positioningKeys,
	useHoverCardHost,
	type HoverCardDismissHandlers,
	type HoverCardEntry,
	type HoverCardPositioning,
	type HoverCardSurfaceOptions,
	type Point,
} from "./HoverCardHost";
import { safeArea } from "./safe-area";

export {
	hoverCardParts,
	hoverCardStyles,
	type HoverCardPart,
	type HoverCardClasses,
	type HoverCardStyles,
} from "@codeui/styles/hovercard";
export { HoverCardGroup, type HoverCardGroupProps } from "./HoverCardHost";

export type HoverCardProps = HoverCardPositioning &
	Pick<KPopoverRootOptions, "open" | "defaultOpen" | "onOpenChange" | "forceMount"> & {
		/** Time in ms from when the pointer enters or the trigger gets focus until the card opens. Defaults to 500. */
		openDelay?: number;
		/** Time in ms from when the pointer leaves the trigger and the card until it closes. Defaults to 150. */
		closeDelay?: number;
		/** Close as soon as the pointer leaves, even on its way from the trigger to the card. */
		ignoreSafeArea?: boolean;
		/**
		 * Share the card with the other hover cards of the page, or of the nearest `HoverCardGroup`.
		 * Defaults to true. With false, or with `forceMount`, the card has a surface of its own.
		 */
		shared?: boolean;
	};

type HoverCardController = {
	open: (point?: Point) => void;
	openNow: () => void;
	isOpen: () => boolean;
	close: () => void;
	cancelOpen: () => void;
	setTrigger: (element: HTMLElement) => void;
	setSurface: (options: HoverCardSurfaceOptions | undefined) => void;
	slot: () => HTMLElement | undefined;
	contains: (target: EventTarget | null) => boolean;
	/** The surface of the hover cards opened from inside this card's content. */
	nested: HoverCardHost;
};

const HoverCardContext = createContext<HoverCardController>();

function useHoverCard() {
	const context = useContext(HoverCardContext);
	if (!context)
		throw new Error("[codeui]: HoverCard parts must be used within a `HoverCard`");
	return context;
}

function positioningFrom(props: HoverCardProps) {
	const positioning = {} as HoverCardPositioning;
	for (const key of positioningKeys)
		Object.defineProperty(positioning, key, { enumerable: true, get: () => props[key] });
	return positioning;
}

function inside(point: Point, rect: DOMRect) {
	return (
		point.x >= rect.left &&
		point.x <= rect.right &&
		point.y >= rect.top &&
		point.y <= rect.bottom
	);
}

/**
 * Kobalte alpha.5's HoverCard root adds its pointer listener inside an effect
 * callback, which Solid 2 rejects as soon as the card opens. The card is built
 * on Kobalte's Popover instead, one popover shared by many cards (see
 * `HoverCardHost`): Popper places it and its dismissable layer handles Escape
 * and outside presses. The hover and focus timers below follow Kobalte's
 * HoverCard. Return to `@kobalte/core/hover-card` once it registers the
 * listener from an effect cleanup.
 */
export function HoverCard(props: ParentProps<HoverCardProps>) {
	const ownSurface = untrack(() => props.shared === false || Boolean(props.forceMount));
	const host = ownSurface
		? createHoverCardHost({
				get forceMount() {
					return props.forceMount;
				},
			})
		: useHoverCardHost();
	const [requested, setRequested] = createSignal(
		untrack(() => props.defaultOpen ?? false),
		{
			ownedWrite: true,
		},
	);
	const wanted = () => props.open ?? requested();
	let state = untrack(wanted);
	const [trigger, setTrigger] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});
	const [surface, setSurface] = createSignal<HoverCardSurfaceOptions | undefined>(
		undefined,
		{
			ownedWrite: true,
		},
	);
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
		if (next === state) return;
		state = next;
		setRequested(next);
		props.onOpenChange?.(next);
	};
	const covers = (point: Point) => {
		const anchor = trigger();
		const card = untrack(host.surface);
		if (!anchor || !card) return false;
		if (inside(point, anchor.getBoundingClientRect())) return true;
		if (inside(point, card.getBoundingClientRect())) return true;
		return (
			!props.ignoreSafeArea &&
			isPointInPolygon([point.x, point.y], safeArea(anchor, card))
		);
	};
	const entry: HoverCardEntry = {
		trigger,
		positioning: positioningFrom(props),
		surface,
		covers,
		dismiss: () => setOpen(false),
	};
	const isOpen = () => host.showing(entry);
	const show = () => {
		cancelOpen();
		cancelClose();
		if (state) host.show(entry);
		else setOpen(true);
	};
	const nested = createHoverCardHost();
	const contains = (target: EventTarget | null) =>
		target instanceof Node &&
		Boolean(
			trigger()?.contains(target) || (isOpen() && withinPortal(target, host.surface())),
		);

	const controller: HoverCardController = {
		open(point) {
			cancelClose();
			if (isOpen() || openTimer) return;
			const delay = host.openDelay(entry, point) ?? props.openDelay ?? 500;
			if (delay <= 0) return show();
			openTimer = setTimeout(show, delay);
		},
		openNow() {
			if (!isOpen()) show();
			else cancelClose();
		},
		isOpen,
		close() {
			cancelOpen();
			if (!isOpen() || closeTimer) return;
			closeTimer = setTimeout(() => setOpen(false), props.closeDelay ?? 150);
		},
		cancelOpen,
		setTrigger,
		setSurface,
		slot: () => host.slotFor(entry),
		contains,
		nested,
	};

	if (ownSurface) host.attach(entry);
	createEffect(wanted, open => {
		state = open;
		if (open) host.show(entry);
		else host.hide(entry);
	});
	createEffect(
		() => (isOpen() ? { trigger: trigger(), content: host.surface() } : undefined),
		elements => {
			if (isServer || !elements) return;
			const onPointerMove = (event: PointerEvent) => {
				if (event.pointerType === "touch") return;
				// A card opened from inside this one keeps it open until that card closes.
				if (contains(event.target) || nested.open()) return cancelClose();
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
		host.release(entry);
	});

	return (
		<HoverCardContext value={controller}>
			{props.children}
			<Show when={ownSurface}>
				<HoverCardSurface host={host} />
			</Show>
		</HoverCardContext>
	);
}

export type HoverCardTriggerProps<T extends ValidComponent = "a"> =
	KPopoverAnchorProps<T> & {
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
		<Polymorphic
			as="a"
			{...others}
			data-expanded={card.isOpen() ? "" : undefined}
			data-closed={card.isOpen() ? undefined : ""}
			ref={[card.setTrigger, local.ref]}
			onPointerEnter={(event: TriggerEvent<PointerEvent>) => {
				callHandler(event, local.onPointerEnter);
				if (event.pointerType !== "touch" && !event.defaultPrevented)
					card.open({ x: event.clientX, y: event.clientY });
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

export type HoverCardContentProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> &
	HoverCardDismissHandlers & {
		class?: string;
		style?: JSX.CSSProperties | string;
		/** Node the card is portaled into. Defaults to `document.body`. */
		mount?: globalThis.Element;
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: Pick<HoverCardClasses, "content">;
	};

function applyRef(ref: unknown, element: HTMLElement) {
	if (Array.isArray(ref)) for (const each of ref) applyRef(each, element);
	else if (typeof ref === "function") ref(element);
}

/**
 * The card's content. It renders into the surface its `HoverCard` shares, which is portaled,
 * placed beside the trigger (on the right unless there is no room), and never takes focus.
 * Its class, style, ref, attributes and event handlers go on that surface while this card is
 * the one shown. Hover cards inside the content get a surface of their own, so the card stays
 * open beside them.
 */
export function HoverCardContent(props: HoverCardContentProps) {
	const card = useHoverCard();
	const attributes = omit(
		props,
		"class",
		"classes",
		"style",
		"mount",
		"ref",
		"children",
		"onEscapeKeyDown",
		"onPointerDownOutside",
		"onFocusOutside",
		"onInteractOutside",
	);
	card.setSurface({
		get class() {
			return props.class;
		},
		get classes() {
			return props.classes;
		},
		get style() {
			return props.style;
		},
		get mount() {
			return props.mount;
		},
		ref: element => applyRef(props.ref, element),
		attributes,
		onEscapeKeyDown: event => props.onEscapeKeyDown?.(event),
		onPointerDownOutside: event => props.onPointerDownOutside?.(event),
		onFocusOutside: event => props.onFocusOutside?.(event),
		onInteractOutside: event => props.onInteractOutside?.(event),
	});
	onCleanup(() => card.setSurface(undefined));
	return (
		<Show when={card.slot()}>
			{slot => (
				<Portal mount={slot()}>
					<HoverCardHostProvider host={card.nested}>
						{props.children}
					</HoverCardHostProvider>
				</Portal>
			)}
		</Show>
	);
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
