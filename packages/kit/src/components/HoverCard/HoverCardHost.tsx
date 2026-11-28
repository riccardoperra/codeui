import { hoverCardParts, type HoverCardClasses } from "@codeui/styles/hovercard";
import {
	Popover as KPopover,
	usePopoverContext,
	type PopoverContentProps as KPopoverContentProps,
	type PopoverRootOptions as KPopoverRootOptions,
} from "@kobalte/core/popover";
import {
	createContext,
	createEffect,
	createMemo,
	createSignal,
	Show,
	untrack,
	useContext,
	type Accessor,
	type ParentProps,
} from "solid-js";
import { isServer, render, type JSX } from "@solidjs/web";
import { mergeClasses } from "../../utils/css";
import { HydratablePortal } from "../../utils/hydratable-portal";
import { LayerScope } from "../../utils/layer-scope";
import { pointerInitiated } from "../../utils/open-source";
import { createPopMotion, motionRef, PopMotionContext } from "../../utils/pop-motion";
import * as styles from "./HoverCard.css";

export type HoverCardPositioning = Pick<
	KPopoverRootOptions,
	| "placement"
	| "gutter"
	| "shift"
	| "flip"
	| "slide"
	| "overlap"
	| "sameWidth"
	| "fitViewport"
	| "hideWhenDetached"
	| "detachedPadding"
	| "arrowPadding"
	| "overflowPadding"
	| "getAnchorRect"
>;

export type HoverCardDismissHandlers = Pick<
	KPopoverContentProps,
	"onEscapeKeyDown" | "onPointerDownOutside" | "onFocusOutside" | "onInteractOutside"
>;

/** What the active card asks of the shared surface: its classes, attributes and handlers. */
export type HoverCardSurfaceOptions = HoverCardDismissHandlers & {
	class?: string;
	classes?: Pick<HoverCardClasses, "content">;
	style?: JSX.CSSProperties | string;
	mount?: globalThis.Element;
	ref: (element: HTMLElement) => void;
};

export type Point = { x: number; y: number };

/** One `HoverCard` as the host sees it. */
export type HoverCardEntry = {
	trigger: Accessor<HTMLElement | undefined>;
	positioning: HoverCardPositioning;
	surface: Accessor<HoverCardSurfaceOptions | undefined>;
	/** True when the point is on the trigger, on the card, or on the way between them. */
	covers: (point: Point) => boolean;
	/** The host showed another card or closed this one: update the card's own state. */
	dismiss: () => void;
};

const defaultSkipDelay = 400;
/** How long the pointer rests on another trigger, while still on the way to the open card, before the card moves. */
const retargetDelay = 150;

const popperDefaults: Required<HoverCardPositioning> = {
	placement: "right-start",
	gutter: 6,
	shift: 0,
	flip: true,
	slide: true,
	overlap: false,
	sameWidth: false,
	fitViewport: false,
	hideWhenDetached: false,
	detachedPadding: 0,
	arrowPadding: 4,
	overflowPadding: 8,
	getAnchorRect: anchor => anchor?.getBoundingClientRect(),
};
export const positioningKeys = Object.keys(
	popperDefaults,
) as (keyof HoverCardPositioning)[];

type HostOptions = {
	skipDelayDuration?: number;
	forceMount?: boolean;
	/** Renders the surface the first time a card opens. Hosts rendered in the tree leave it out. */
	mount?: (host: HoverCardHost) => void;
};

type Size = { width: number; height: number };

/** The layout size, without the scale of a pop that may still be running. */
function sizeOf(element: HTMLElement): Size {
	return { width: element.offsetWidth, height: element.offsetHeight };
}

/** Inkstone §7.3: a content change takes the panel duration and the kit's ease-out. */
const slide = "transform var(--cui-motion-duration-panel) var(--cui-motion-ease-out)";

/**
 * How the surface moves to the next card. A keyboard move swaps in place (Inkstone: nothing
 * from the keyboard animates). Reduced motion keeps only the content fade.
 */
type Morph = { kind: "move"; from: Size } | { kind: "fade" };

function reducedMotion() {
	return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One floating surface that every card of a group, or of the page, shares.
 * Opening a card while another is open, or shortly after it closed, moves the
 * surface to the new trigger and swaps the content instead of closing one card
 * and opening another.
 */
export function createHoverCardHost(options: HostOptions = {}) {
	const [current, setCurrent] = createSignal<HoverCardEntry | undefined>(undefined, {
		ownedWrite: true,
	});
	const [open, setOpen] = createSignal(false, { ownedWrite: true });
	const [surface, setSurface] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});
	const [slot, setSlot] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});
	let shown: HoverCardEntry | undefined;
	let isOpen = false;
	let lastClosed = -Infinity;
	let element: HTMLElement | undefined;
	let morph: Morph | undefined;

	const recentlyClosed = () =>
		performance.now() - lastClosed < (options.skipDelayDuration ?? defaultSkipDelay);
	const close = () => {
		if (!isOpen) return;
		isOpen = false;
		lastClosed = performance.now();
		setOpen(false);
	};
	const startMorph = (from: HTMLElement) => {
		if (!pointerInitiated({ hover: true })) return;
		if (reducedMotion()) {
			morph = { kind: "fade" };
			return;
		}
		morph = { kind: "move", from: sizeOf(from) };
		const positioner = from.parentElement;
		if (positioner) positioner.style.transition = slide;
	};

	const host = {
		current,
		open,
		surface,
		slot,
		setSlot,
		forceMount: () => options.forceMount ?? false,
		recentlyClosed,
		setSurface(next: HTMLElement | undefined) {
			element = next;
			setSurface(next);
		},
		showing: (entry: HoverCardEntry) => open() && current() === entry,
		slotFor: (entry: HoverCardEntry) => (current() === entry ? slot() : undefined),
		/** 0 to open at once, or undefined to wait for the card's own `openDelay`. */
		openDelay(entry: HoverCardEntry, point?: Point): number | undefined {
			if (isOpen && shown && shown !== entry)
				return point && shown.covers(point) ? retargetDelay : 0;
			return recentlyClosed() ? 0 : undefined;
		},
		/** Makes the entry the one whose content the surface holds, without opening it. */
		attach(entry: HoverCardEntry) {
			if (shown) return;
			shown = entry;
			setCurrent(() => entry);
		},
		show(entry: HoverCardEntry) {
			if (isOpen && shown === entry) return;
			options.mount?.(host);
			const previous = shown;
			const previousOpen = isOpen;
			if (previous && previous !== entry && element?.isConnected) startMorph(element);
			shown = entry;
			isOpen = true;
			setCurrent(() => entry);
			setOpen(true);
			if (previous && previous !== entry && previousOpen) previous.dismiss();
		},
		hide(entry: HoverCardEntry) {
			if (shown === entry) close();
		},
		/** Escape, a press outside, or a focus outside closed the surface. */
		dismiss() {
			const entry = shown;
			close();
			entry?.dismiss();
		},
		/** The card unmounted. Its content leaves with it, so the surface closes without an exit. */
		release(entry: HoverCardEntry) {
			if (shown !== entry) return;
			element?.setAttribute("data-motion", "none");
			shown = undefined;
			isOpen = false;
			setOpen(false);
			setCurrent(undefined);
		},
		takeMorph() {
			const next = morph;
			morph = undefined;
			return next;
		},
	};
	return host;
}

export type HoverCardHost = ReturnType<typeof createHoverCardHost>;

const HostContext = createContext<HoverCardHost | null>(null);

let pageHost: HoverCardHost | undefined;

function mountPageSurface(host: HoverCardHost) {
	let mounted = false;
	return () => {
		if (mounted) return;
		mounted = true;
		// Out of the effect that opened the card, so `render` does not flush inside it.
		queueMicrotask(() => {
			const container = document.createElement("div");
			container.setAttribute("data-cui", "hovercard-host");
			container.style.display = "contents";
			document.body.append(container);
			render(() => <HoverCardSurface host={host} />, container);
		});
	};
}

/** The host of the nearest `HoverCardGroup`, or the one the whole page shares. */
export function useHoverCardHost(): HoverCardHost {
	const group = useContext(HostContext);
	if (group) return group;
	if (isServer) return createHoverCardHost();
	if (!pageHost) {
		let mount: (() => void) | undefined;
		pageHost = createHoverCardHost({ mount: () => mount?.() });
		mount = mountPageSurface(pageHost);
	}
	return pageHost;
}

export type HoverCardGroupProps = ParentProps<{
	/** Time in ms after a card closes during which the next card in the group opens at once. Defaults to 400. */
	skipDelayDuration?: number;
}>;

/**
 * Gives the hover cards inside it their own surface. Moving between their triggers moves
 * that card, and they never take over the surface of the cards outside the group.
 */
export function HoverCardGroup(props: HoverCardGroupProps) {
	const host = createHoverCardHost({
		get skipDelayDuration() {
			return props.skipDelayDuration;
		},
	});
	return (
		<HostContext value={host}>
			{props.children}
			<HoverCardSurface host={host} />
		</HostContext>
	);
}

function positioningOf(entry: Accessor<HoverCardEntry | undefined>) {
	const positioning = {} as Required<HoverCardPositioning>;
	for (const key of positioningKeys)
		Object.defineProperty(positioning, key, {
			enumerable: true,
			get: () => entry()?.positioning[key] ?? popperDefaults[key],
		});
	return positioning;
}

/** The popover the host places next to the active trigger. */
export function HoverCardSurface(props: { host: HoverCardHost }) {
	const host = untrack(() => props.host);
	const motion = createPopMotion({
		get open() {
			return host.open();
		},
		get forceMount() {
			return host.forceMount();
		},
		onOpenChange(next: boolean) {
			if (!next) host.dismiss();
		},
	});
	return (
		<PopMotionContext value={motion.setTarget}>
			<KPopover
				{...positioningOf(host.current)}
				open={host.open()}
				onOpenChange={motion.onOpenChange}
				forceMount={motion.forceMount()}
				anchorRef={() => host.current()?.trigger()}
			>
				<SurfaceContent host={host} />
			</KPopover>
		</PopMotionContext>
	);
}

type PointerDownOutsideEvent = Parameters<
	NonNullable<KPopoverContentProps["onPointerDownOutside"]>
>[0];

function SurfaceContent(props: { host: HoverCardHost }) {
	const host = untrack(() => props.host);
	const popover = usePopoverContext();
	const options = () => host.current()?.surface();
	const mount = createMemo(() => options()?.mount);
	createMorph(host);
	createEffect(
		() => ({ element: host.surface(), ref: options()?.ref }),
		({ element, ref }) => {
			if (element && ref) ref(element);
		},
	);
	return (
		<Show when={popover.contentPresent()}>
			<HydratablePortal mount={mount()}>
				<LayerScope>
					<KPopover.Content
						role={undefined}
						style={options()?.style}
						ref={[
							motionRef({ hover: true, still: host.recentlyClosed }),
							host.setSurface,
						]}
						onEscapeKeyDown={(event: KeyboardEvent) =>
							options()?.onEscapeKeyDown?.(event)
						}
						onPointerDownOutside={(event: PointerDownOutsideEvent) => {
							options()?.onPointerDownOutside?.(event);
							// A press on a trigger is a click that keeps the card open or moves it there.
							if (onTrigger(event.target)) event.preventDefault();
						}}
						onFocusOutside={(
							event: Parameters<NonNullable<KPopoverContentProps["onFocusOutside"]>>[0],
						) => {
							options()?.onFocusOutside?.(event);
							// Focus on another trigger moves the card there. Leaving the previous
							// trigger closes it through its blur handler and closeDelay instead.
							if (onTrigger(event.target)) event.preventDefault();
						}}
						onInteractOutside={(
							event: Parameters<
								NonNullable<KPopoverContentProps["onInteractOutside"]>
							>[0],
						) => options()?.onInteractOutside?.(event)}
						data-cui={hoverCardParts.content}
						class={mergeClasses(
							styles.content(),
							options()?.classes?.content,
							options()?.class,
						)}
					>
						<div ref={host.setSlot} style={{ display: "contents" }} />
					</KPopover.Content>
				</LayerScope>
			</HydratablePortal>
		</Show>
	);
}

function onTrigger(target: EventTarget | null) {
	return (
		target instanceof Element &&
		Boolean(target.closest(`[data-cui=${hoverCardParts.trigger}]`))
	);
}

function motionTiming(element: HTMLElement): KeyframeAnimationOptions {
	const style = getComputedStyle(element);
	const raw = style.getPropertyValue("--cui-motion-duration-panel").trim();
	const value = Number.parseFloat(raw);
	const duration = Number.isFinite(value)
		? raw.endsWith("ms")
			? value
			: value * 1000
		: 200;
	const easing = style.getPropertyValue("--cui-motion-ease-out").trim() || "ease-out";
	return { duration, easing };
}

/**
 * When the surface moves to another card it keeps its old size for a moment and
 * grows or shrinks to the new one while the new content fades in. The positioner's
 * transform transition, set when the move starts, slides it to the new trigger.
 * Width and height animate because the card's text has to reflow at its real size:
 * a scale would stretch it. The card is small and the change lasts 200ms, like the
 * accordion's height in Inkstone's Expand.
 */
function createMorph(host: HoverCardHost) {
	createEffect(
		() => host.current(),
		() => {
			const morph = host.takeMorph();
			const surface = untrack(host.surface);
			const positioner = surface?.parentElement;
			if (!morph || !surface) return;
			const timing = motionTiming(surface);
			const animations: Animation[] = [];
			if (morph.kind === "move") {
				if (positioner) positioner.style.transition = slide;
				const to = sizeOf(surface);
				animations.push(
					surface.animate(
						[
							{ width: `${morph.from.width}px`, height: `${morph.from.height}px` },
							{ width: `${to.width}px`, height: `${to.height}px` },
						],
						timing,
					),
				);
			}
			for (const child of untrack(host.slot)?.children ?? [])
				animations.push(child.animate([{ opacity: 0 }, { opacity: 1 }], timing));
			const settle = setTimeout(() => {
				if (positioner) positioner.style.transition = "";
			}, Number(timing.duration));
			return () => {
				clearTimeout(settle);
				for (const animation of animations) animation.cancel();
				if (positioner) positioner.style.transition = "";
			};
		},
	);
}
