import { Tooltip as KTooltip, TooltipRootProps as KTooltipRootProps } from "@kobalte/core/tooltip";
import { createEffect, createSignal, JSX, mergeProps, onCleanup, splitProps } from "solid-js";
import { SlotProp } from "../../utils/component";
import { mergeClasses } from "../../utils/css";
import { motionRef } from "../../utils/open-source";
import * as styles from "./Tooltip.css";

type TooltipSlot = "trigger" | "content";

export type TooltipProps = KTooltipRootProps &
	styles.TooltipVariants &
	SlotProp<TooltipSlot> & {
		content: JSX.Element;
		/** Portal target for the content. Defaults to `document.body`. */
		mount?: Node;
	};

const focusable =
	"a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex='-1']), [contenteditable=true]";

// Kobalte 0.13.13+ sets type="button" on the trigger. On a div it means nothing, and CSS resets that target [type="button"] would restyle it.
// Kobalte also puts `aria-describedby` on the trigger. The wrapper div is not what gets focus, so it goes on
// the first focusable child, where a screen reader reads it.
function TriggerElement(
	props: JSX.HTMLAttributes<HTMLDivElement> & { type?: string; "aria-describedby"?: string },
) {
	const [local, others] = splitProps(props, ["type", "onFocus", "onBlur", "aria-describedby", "ref"]);
	let wrapper!: HTMLDivElement;
	createEffect(() => {
		const description = local["aria-describedby"];
		const target = wrapper.querySelector<HTMLElement>(focusable) ?? wrapper;
		if (!description) return;
		const previous = target.getAttribute("aria-describedby");
		target.setAttribute("aria-describedby", previous ? `${previous} ${description}` : description);
		onCleanup(() => {
			if (previous) target.setAttribute("aria-describedby", previous);
			else target.removeAttribute("aria-describedby");
		});
	});
	return (
		<div
			ref={element => {
				wrapper = element;
				(local.ref as ((element: HTMLDivElement) => void) | undefined)?.(element);
			}}
			onFocusIn={local.onFocus}
			onFocusOut={local.onBlur}
			{...others}
		/>
	);
}

/** Kobalte's default: a tooltip opened this soon after another closed skips its delay. */
const skipDelayDuration = 300;
let lastClosed = -Infinity;

export function Tooltip(props: TooltipProps) {
	props = mergeProps(
		{
			gutter: 4,
			shift: 0,
			openDelay: 200,
			closeDelay: 0,
		},
		props,
	);

	const [open, setOpen] = createSignal(false);
	const [local, internal, others] = splitProps(
		props,
		["theme", "slotClasses", "onOpenChange", "mount"],
		["children", "content"],
	);

	const onOpenChange = (next: boolean) => {
		if (!next && open()) lastClosed = performance.now();
		setOpen(next);
		local.onOpenChange?.(next);
	};

	// Opened from keyboard focus: no animation. The next tooltip after one
	// closes skips the delay, so it skips the animation too.
	const contentRef = motionRef({
		hover: true,
		still: () => performance.now() - lastClosed < (others.skipDelayDuration ?? skipDelayDuration),
	});

	const contentClasses = () =>
		mergeClasses(
			local.slotClasses?.content,
			styles.tooltipContent({
				theme: local.theme,
			}),
		);

	return (
		<KTooltip open={open()} onOpenChange={onOpenChange} {...others}>
			<KTooltip.Trigger as={TriggerElement} data-cui="tooltip-trigger" class={mergeClasses(local.slotClasses?.trigger, styles.trigger)}>
				{internal.children}
			</KTooltip.Trigger>
			<KTooltip.Portal mount={local.mount}>
				<KTooltip.Content ref={contentRef} data-cui="tooltip-content" class={contentClasses()}>
					{internal.content}
				</KTooltip.Content>
			</KTooltip.Portal>
		</KTooltip>
	);
}
