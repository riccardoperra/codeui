type Sample = { y: number; time: number };

type Drag = {
	pointer: number;
	startY: number;
	/** Offset of the sheet when the pointer grabbed it, non-zero when it caught a settle. */
	base: number;
	offset: number;
	moved: boolean;
	samples: Sample[];
};

export type SheetDragOptions = {
	content: () => HTMLElement | null;
	overlay: () => HTMLElement | undefined;
	/** Closes the sheet once it has left the screen. */
	dismiss: () => void;
};

const TAP_SLOP = 4;
const DISMISS_DISTANCE = 0.35;
/** Release speed in px/ms that dismisses the sheet whatever the distance. */
const DISMISS_VELOCITY = 0.5;
const VELOCITY_WINDOW = 80;

/** Resistance past the open position, from Apple's fluid interfaces sample. */
function rubberband(overshoot: number, dimension: number) {
	const constant = 0.55;
	return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

function velocity(samples: Sample[]) {
	const last = samples[samples.length - 1];
	const first = samples.find(sample => last.time - sample.time <= VELOCITY_WINDOW) ?? last;
	const elapsed = last.time - first.time;
	return elapsed > 0 ? (last.y - first.y) / elapsed : 0;
}

function motionToken(element: HTMLElement) {
	const style = getComputedStyle(element);
	const duration = parseFloat(style.getPropertyValue("--cui-motion-duration-panel"));
	return {
		duration: Number.isFinite(duration) ? duration : 200,
		easing: style.getPropertyValue("--cui-motion-ease-out").trim() || "ease-out",
	};
}

const reducedMotion = () => !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Drag to dismiss for a bottom sheet. While the pointer is down the sheet
 * follows it 1:1. On release it settles open or slides away, and a new grab
 * catches it mid-settle.
 */
export function createSheetDrag(options: SheetDragOptions) {
	let drag: Drag | undefined;
	let settling: Animation | undefined;
	let suppressClick = false;

	const apply = (content: HTMLElement, offset: number) => {
		content.style.transform = offset ? `translateY(${offset}px)` : "";
		const overlay = options.overlay();
		if (overlay) {
			const progress = Math.max(0, offset) / Math.max(1, content.offsetHeight);
			overlay.style.opacity = offset > 0 ? String(1 - progress) : "";
		}
	};

	const stopSettling = (content: HTMLElement) => {
		const offset = settling ? new DOMMatrixReadOnly(getComputedStyle(content).transform).m42 : 0;
		settling?.cancel();
		settling = undefined;
		options
			.overlay()
			?.getAnimations?.()
			.forEach(animation => animation.cancel());
		return offset;
	};

	/** Moves the sheet from `from` to `to`, then calls `done` unless a grab caught it first. */
	const settle = (content: HTMLElement, from: number, to: number, speed: number, done: () => void) => {
		if (reducedMotion() || typeof content.animate !== "function") {
			done();
			return;
		}
		const token = motionToken(content);
		// A fast release finishes at least as fast as the finger was moving.
		const duration = speed > 0 ? Math.min(token.duration, Math.abs(to - from) / speed) : token.duration;
		const timing = { duration, easing: token.easing, fill: "forwards" } as const;
		const overlay = options.overlay();
		const opacity = overlay?.style.opacity || "1";
		apply(content, 0);
		const animation = content.animate(
			[{ transform: `translateY(${from}px)` }, { transform: `translateY(${to}px)` }],
			timing,
		);
		overlay?.animate([{ opacity }, { opacity: to > 0 ? "0" : "1" }], timing);
		settling = animation;
		animation.finished.then(
			() => {
				if (settling === animation) done();
			},
			() => {},
		);
	};

	const release = (event: PointerEvent, cancelled: boolean) => {
		const content = options.content();
		if (!content || !drag || drag.pointer !== event.pointerId) return;
		const { offset, moved, samples } = drag;
		drag = undefined;
		if (!moved && offset === 0) return;
		suppressClick = true;
		const speed = velocity(samples);
		const far = offset > content.offsetHeight * DISMISS_DISTANCE;
		const flicked = offset > 0 && speed > DISMISS_VELOCITY;
		if (!cancelled && (far || flicked)) {
			settle(content, offset, Math.max(offset, content.offsetHeight), speed, options.dismiss);
		} else {
			settle(content, offset, 0, 0, () => {
				stopSettling(content);
				apply(content, 0);
			});
		}
	};

	return {
		onPointerDown(event: PointerEvent & { currentTarget: HTMLElement }) {
			const content = options.content();
			if (!content || drag || event.button !== 0) return;
			const base = stopSettling(content);
			apply(content, base);
			suppressClick = false;
			drag = {
				pointer: event.pointerId,
				startY: event.clientY,
				base,
				offset: base,
				moved: false,
				samples: [{ y: event.clientY, time: performance.now() }],
			};
			event.currentTarget.setPointerCapture?.(event.pointerId);
		},
		onPointerMove(event: PointerEvent) {
			const content = options.content();
			if (!content || !drag || drag.pointer !== event.pointerId) return;
			const distance = event.clientY - drag.startY;
			const raw = drag.base + distance;
			drag.offset = raw >= 0 ? raw : rubberband(raw, content.offsetHeight);
			drag.moved ||= Math.abs(distance) > TAP_SLOP;
			drag.samples.push({ y: event.clientY, time: performance.now() });
			if (drag.samples.length > 8) drag.samples.shift();
			apply(content, drag.offset);
		},
		onPointerUp: (event: PointerEvent) => release(event, false),
		onPointerCancel: (event: PointerEvent) => release(event, true),
		/** True once for the click that follows a drag, which must not close the sheet. */
		consumeClick() {
			const suppressed = suppressClick;
			suppressClick = false;
			return suppressed;
		},
	};
}
