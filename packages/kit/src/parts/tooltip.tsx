import "@codeui/styles/theme.css";
import "@codeui/styles/tooltip.css";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	Tooltip as KTooltip,
	type TooltipContentProps,
	type TooltipRootProps,
	type TooltipTriggerProps,
} from "@kobalte/core/tooltip";
import { mergeRefs } from "@kobalte/utils";
import {
	createContext,
	createEffect,
	createSignal,
	mergeProps,
	onCleanup,
	splitProps,
	useContext,
	type JSX,
	type ValidComponent,
} from "solid-js";
import * as styles from "../components/Tooltip/Tooltip.css";
import { mergeClasses } from "../utils/css";
import { motionRef } from "../utils/open-source";

const focusable =
	"a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex='-1']), [contenteditable=true]";

// Kobalte 0.13.13+ sets type="button" on the trigger. On a div it means nothing, and CSS resets that target [type="button"] would restyle it.
// Kobalte also puts `aria-describedby` on the trigger. The wrapper div is not what gets focus, so it goes on
// the first focusable child, where a screen reader reads it.
function TriggerElement(
	props: JSX.HTMLAttributes<HTMLDivElement> & {
		type?: string;
		"aria-describedby"?: string;
	},
) {
	const [local, others] = splitProps(props, [
		"type",
		"onFocus",
		"onBlur",
		"aria-describedby",
		"ref",
	]);
	let wrapper!: HTMLDivElement;
	createEffect(() => {
		const description = local["aria-describedby"];
		const target = wrapper.querySelector<HTMLElement>(focusable) ?? wrapper;
		if (!description) return;
		const previous = target.getAttribute("aria-describedby");
		target.setAttribute(
			"aria-describedby",
			previous ? `${previous} ${description}` : description,
		);
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

const skipDelayDuration = 300;
let lastClosed = -Infinity;

const TooltipMotionContext = createContext<() => number>(() => skipDelayDuration);

export type RootProps = TooltipRootProps;

export function Root(props: RootProps) {
	const [local, others] = splitProps(props, ["onOpenChange"]);
	const options = mergeProps(
		{ gutter: 4, shift: 0, openDelay: 200, closeDelay: 0 },
		others,
	);
	const [open, setOpen] = createSignal(false);

	const onOpenChange = (next: boolean) => {
		if (!next && open()) lastClosed = performance.now();
		setOpen(next);
		local.onOpenChange?.(next);
	};

	return (
		<TooltipMotionContext.Provider
			value={() => options.skipDelayDuration ?? skipDelayDuration}
		>
			<KTooltip open={open()} onOpenChange={onOpenChange} {...options} />
		</TooltipMotionContext.Provider>
	);
}

export type TriggerProps<T extends ValidComponent = "div"> = TooltipTriggerProps<T>;

export function Trigger<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TriggerProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", TriggerProps>, [
		"class",
	]);
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
	const [local, others] = splitProps(props as PolymorphicProps<"div", ContentProps>, [
		"class",
		"ref",
		"theme",
	]);
	const delay = useContext(TooltipMotionContext);
	const contentRef = motionRef({
		hover: true,
		still: () => performance.now() - lastClosed < delay(),
	});

	return (
		<KTooltip.Content
			{...others}
			ref={mergeRefs(contentRef, local.ref)}
			data-cui="tooltip-content"
			data-theme={local.theme ?? "primary"}
			class={mergeClasses(local.class, styles.tooltipContent())}
		/>
	);
}

export { Portal, type TooltipPortalProps as PortalProps } from "@kobalte/core/tooltip";
