import { pickProps } from "../utils/pick-props";
import "@codeui/styles/theme.css";
import "@codeui/styles/tooltip.css";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	Tooltip as KTooltip,
	type TooltipContentProps,
	type TooltipRootProps,
	type TooltipTriggerProps,
} from "@kobalte/core/tooltip";
import { createContext, createEffect, useContext, omit, type ParentProps } from "solid-js";
import { type JSX, type ValidComponent } from "@solidjs/web";
import * as styles from "../components/Tooltip/Tooltip.css";
import { mergeClasses } from "../utils/css";
import { LayerScope } from "../utils/layer-scope";
import { createPopMotion, motionRef, PopMotionContext } from "../utils/pop-motion";

const focusable =
	"a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex='-1']), [contenteditable=true]";

// Kobalte sets type="button" on the trigger. On a div it means nothing, and CSS resets that target [type="button"] would restyle it.
// Kobalte also puts `aria-describedby` on the trigger. The wrapper div is not what gets focus, so it goes on
// the first focusable child, where a screen reader reads it.
function TriggerElement(
	props: JSX.HTMLAttributes<HTMLDivElement> & {
		type?: string;
		"aria-describedby"?: string;
	},
) {
	const local = pickProps(props, "type", "onFocus", "onBlur", "aria-describedby", "ref");
	const others = omit(props, "type", "onFocus", "onBlur", "aria-describedby", "ref");
	let wrapper!: HTMLDivElement;
	createEffect(
		() => local["aria-describedby"],
		description => {
			const target = wrapper.querySelector<HTMLElement>(focusable) ?? wrapper;
			if (!description) return;
			const previous = target.getAttribute("aria-describedby");
			target.setAttribute(
				"aria-describedby",
				previous ? `${previous} ${description}` : description,
			);
			return () => {
				if (previous) target.setAttribute("aria-describedby", previous);
				else target.removeAttribute("aria-describedby");
			};
		},
	);
	return (
		<div
			ref={[
				local.ref,
				(element: HTMLDivElement) => {
					wrapper = element;
				},
			]}
			onFocusIn={local.onFocus}
			onFocusOut={local.onBlur}
			{...others}
		/>
	);
}

const skipDelayDuration = 400;
let lastClosed = -Infinity;

export type TooltipDefaults = Pick<
	TooltipRootProps,
	"openDelay" | "closeDelay" | "skipDelayDuration" | "gutter" | "shift"
> &
	NonNullable<styles.TooltipVariants>;

const DefaultsContext = createContext<TooltipDefaults>({});

/**
 * Sets the defaults of every tooltip below it. A prop on a tooltip still wins.
 */
export function Provider(props: ParentProps<TooltipDefaults>) {
	const parent = useContext(DefaultsContext);
	const defaults: TooltipDefaults = {
		get openDelay() { return props.openDelay ?? parent.openDelay; },
		get closeDelay() { return props.closeDelay ?? parent.closeDelay; },
		get skipDelayDuration() { return props.skipDelayDuration ?? parent.skipDelayDuration; },
		get gutter() { return props.gutter ?? parent.gutter; },
		get shift() { return props.shift ?? parent.shift; },
		get variant() { return props.variant ?? parent.variant; },
	};
	return <DefaultsContext value={defaults}>{props.children}</DefaultsContext>;
}

const TooltipMotionContext = createContext<() => number>(() => skipDelayDuration);

export type RootProps = TooltipRootProps;

export function Root(props: RootProps) {
	const defaults = useContext(DefaultsContext);
	const others = omit(props, "forceMount", "onOpenChange");
	const skipDelay = () =>
		props.skipDelayDuration ?? defaults.skipDelayDuration ?? skipDelayDuration;
	const motion = createPopMotion({
		get open() { return props.open; },
		get defaultOpen() { return props.defaultOpen; },
		get forceMount() { return props.forceMount; },
		onOpenChange(next) {
			if (!next) lastClosed = performance.now();
			props.onOpenChange?.(next);
		},
	});

	return (
		<TooltipMotionContext value={skipDelay}>
			<PopMotionContext value={motion.setTarget}>
				<KTooltip
					{...others}
					forceMount={motion.forceMount()}
					onOpenChange={motion.onOpenChange}
					gutter={props.gutter ?? defaults.gutter ?? 4}
					shift={props.shift ?? defaults.shift ?? 0}
					openDelay={props.openDelay ?? defaults.openDelay ?? 700}
					closeDelay={props.closeDelay ?? defaults.closeDelay ?? 0}
					skipDelayDuration={skipDelay()}
				/>
			</PopMotionContext>
		</TooltipMotionContext>
	);
}

export type TriggerProps<T extends ValidComponent = "div"> = TooltipTriggerProps<T>;

export function Trigger<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TriggerProps<T>>,
) {
	const local = props as PolymorphicProps<"div", TriggerProps>;
	const others = omit(local, "class");
	return (
		<KTooltip.Trigger
			as={TriggerElement}
			{...others}
			data-cui="tooltip-trigger"
			class={mergeClasses(local.class, styles.trigger)}
		/>
	);
}

export type ContentProps<T extends ValidComponent = "div"> = TooltipContentProps<T> &
	NonNullable<styles.TooltipVariants>;

export function Content<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ContentProps<T>>,
) {
	const local = props as PolymorphicProps<"div", ContentProps>;
	const others = omit(local, "class", "ref", "variant");
	const delay = useContext(TooltipMotionContext);
	const defaults = useContext(DefaultsContext);
	const contentRef = motionRef({
		hover: true,
		still: () => performance.now() - lastClosed < delay(),
	});

	return (
		<LayerScope>
			<KTooltip.Content
				{...others}
				ref={[contentRef, local.ref]}
				data-cui="tooltip-content"
				data-variant={local.variant ?? defaults.variant ?? "secondary"}
				class={mergeClasses(local.class, styles.tooltipContent())}
			/>
		</LayerScope>
	);
}

export { Portal, type TooltipPortalProps as PortalProps } from "@kobalte/core/tooltip";
