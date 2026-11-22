import { createContext, createEffect, createSignal, untrack, useContext } from "solid-js";
import { mapKobalteVariables } from "./kobalte-style";
import { pointerInitiated } from "./open-source";

type OverlayProps<Args extends unknown[]> = {
	open?: boolean;
	defaultOpen?: boolean;
	forceMount?: boolean;
	onOpenChange?: (open: boolean, ...args: Args) => void;
};

type MotionTarget = {
	element: HTMLElement;
	applyMotion: () => boolean;
};

export const PopMotionContext = createContext<((target: MotionTarget) => void) | null>(null);
const popExit = /^cui-motion-(pop|fade)-out$/;

/** Hold Kobalte's portalled content through its CSS exit. Alpha.5 unmounts at once. */
export function createPopMotion<Args extends unknown[]>(props: OverlayProps<Args>) {
	const [requested, setRequested] = createSignal(untrack(() => props.defaultOpen ?? false));
	const [target, setTarget] = createSignal<MotionTarget>();
	const [animate, setAnimate] = createSignal(false);
	const open = () => props.open ?? requested();
	const closing = () => animate() && !open() && !props.forceMount;

	const onOpenChange = (next: boolean, ...args: Args) => {
		setRequested(next);
		props.onOpenChange?.(next, ...args);
	};

	createEffect(
		() => ({ open: open(), target: target(), forced: props.forceMount }),
		({ open, target, forced }) => {
			if (!target) return;
			const { element, applyMotion } = target;
			if (open) {
				setAnimate(applyMotion());
				return;
			}
			if (forced) return;
			if (!untrack(animate)) {
				setTarget(undefined);
				return;
			}

			const wasInert = element.inert;
			element.inert = true;
			const listeners = new AbortController();
			let timeout: ReturnType<typeof setTimeout> | undefined;
			const finish = () => {
				if (listeners.signal.aborted) return;
				setTarget(undefined);
				setAnimate(false);
			};
			queueMicrotask(() => {
				if (listeners.signal.aborted) return;
				const exits = element.getAnimations().filter(animation =>
					animation instanceof CSSAnimation && popExit.test(animation.animationName),
				);
				if (!exits.length) {
					finish();
					return;
				}
				const onExit = (event: AnimationEvent) => {
					if (event.target === element && popExit.test(event.animationName)) {
						clearTimeout(timeout);
						timeout = setTimeout(finish, 0);
					}
				};
				element.addEventListener("animationend", onExit, { signal: listeners.signal });
				element.addEventListener("animationcancel", onExit, { signal: listeners.signal });
				// The finished promises settle before CSS events. Use them as a fallback
				// if the page intercepts an event or the animation is replaced.
				void Promise.allSettled(exits.map(animation => animation.finished)).then(() => {
					if (listeners.signal.aborted || timeout !== undefined) return;
					timeout = setTimeout(finish, 64);
				});
			});
			return () => {
				listeners.abort();
				clearTimeout(timeout);
				element.inert = wasInert;
			};
		},
	);

	return {
		setTarget,
		onOpenChange,
		closing,
		present: () => props.forceMount || open() || closing(),
		forceMount: () => props.forceMount || closing(),
	};
}

export function motionRef(options?: { hover?: boolean; still?: () => boolean }) {
	const setTarget = useContext(PopMotionContext);
	return (element: HTMLElement) => {
		mapKobalteVariables(element);
		const applyMotion = () => {
			const animated = !options?.still?.() && pointerInitiated(options);
			if (animated) element.removeAttribute("data-motion");
			else element.setAttribute("data-motion", "none");
			return animated;
		};
		applyMotion();
		setTarget?.({ element, applyMotion });
	};
}
