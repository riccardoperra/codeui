"use client";

import {
	accordionParts,
	accordionStyleProps,
	accordionStyles,
	contentBody,
	type AccordionClasses,
} from "@codeui/styles/accordion";
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import {
	Button,
	Disclosure,
	DisclosureGroup,
	DisclosurePanel,
	DisclosureStateContext,
	Heading,
	type DisclosureGroupProps,
	type DisclosurePanelProps,
	type DisclosureProps,
} from "react-aria-components";
import { classes } from "../classes";
import { useInputTracking, withClasses } from "./shared";

export type { AccordionClasses };

type AccordionContextValue = {
	density?: "default" | "compact" | "comfortable";
	classes?: AccordionClasses;
};
const AccordionContext = createContext<AccordionContextValue>({});

export type AccordionProps = DisclosureGroupProps & {
	/** Trigger padding. Defaults to `default`. */
	density?: "default" | "compact" | "comfortable";
	/** `auto` animates pointer toggles; `none` never animates. Keyboard toggles never animate. */
	motion?: "auto" | "none";
	/** Classes for the parts the accordion renders, keyed by part name. */
	classes?: AccordionClasses;
};

/**
 * Sections that expand one at a time (Inkstone §8). A React Aria
 * DisclosureGroup: pass `allowsMultipleExpanded` to open several, and
 * `expandedKeys` or `defaultExpandedKeys` with the item ids.
 */
export function Accordion({
	density,
	motion,
	classes: slots,
	className,
	...props
}: AccordionProps) {
	useInputTracking();
	return (
		<AccordionContext.Provider value={{ density, classes: slots }}>
			<DisclosureGroup
				{...props}
				data-cui={accordionParts.root}
				data-motion={motion ?? "auto"}
				className={withClasses(className, accordionStyles.root(), slots?.root)}
			/>
		</AccordionContext.Provider>
	);
}

export type AccordionItemProps = DisclosureProps;

/** One section. Its `id` is the key in the accordion's `expandedKeys`. */
export function AccordionItem({ className, ...props }: AccordionItemProps) {
	const { classes: slots } = useContext(AccordionContext);
	return (
		<Disclosure
			{...props}
			data-cui={accordionParts.item}
			className={withClasses(className, accordionStyles.item(), slots?.item)}
		/>
	);
}

export type AccordionTriggerProps = {
	/** The section title. */
	children: ReactNode;
	/** A 16px icon before the title. It turns accent while the section is open. */
	icon?: ReactNode;
	/** A secondary value on the right, such as the current setting. Truncated. */
	summary?: ReactNode;
	className?: string;
	/** Heading level of the header. Defaults to 3. */
	level?: number;
};

/** The header row: icon, title, summary and chevron, inside a heading. */
export function AccordionTrigger({
	children,
	icon,
	summary,
	className,
	level = 3,
}: AccordionTriggerProps) {
	const { density, classes: slots } = useContext(AccordionContext);
	const state = useContext(DisclosureStateContext);
	const { class: trigger, ...appearance } = accordionStyleProps({ density });
	return (
		<Heading
			level={level}
			data-cui={accordionParts.header}
			className={classes(accordionStyles.header(), slots?.header)}
		>
			<Button
				slot="trigger"
				{...appearance}
				data-expanded={state?.isExpanded ? "" : undefined}
				className={classes(trigger, slots?.trigger, className)}
			>
				{icon != null && (
					<span
						data-cui={accordionParts.icon}
						aria-hidden="true"
						className={classes(accordionStyles.icon(), slots?.icon)}
					>
						{icon}
					</span>
				)}
				<span
					data-cui={accordionParts.title}
					className={classes(accordionStyles.title(), slots?.title)}
				>
					{children}
				</span>
				{summary != null && (
					<span
						data-cui={accordionParts.summary}
						className={classes(accordionStyles.summary(), slots?.summary)}
					>
						{summary}
					</span>
				)}
				<span
					data-cui={accordionParts.chevron}
					aria-hidden="true"
					className={classes(accordionStyles.chevron(), slots?.chevron)}
				>
					›
				</span>
			</Button>
		</Heading>
	);
}

export type AccordionPanelProps = DisclosurePanelProps;

/** The section body. Everything in an open section stays visible. */
export function AccordionPanel({
	className,
	style,
	children,
	...props
}: AccordionPanelProps) {
	const { classes: slots } = useContext(AccordionContext);
	const state = useContext(DisclosureStateContext);
	// React Aria measures the panel into `--disclosure-panel-height` and waits for the transition.
	const height = {
		"--cui-accordion-content-height": "var(--disclosure-panel-height, auto)",
	} as CSSProperties;
	return (
		<DisclosurePanel
			{...props}
			data-cui={accordionParts.content}
			data-open={state?.isExpanded ? "" : undefined}
			style={
				typeof style === "function"
					? values => ({ ...height, ...style(values) })
					: { ...height, ...style }
			}
			className={withClasses(className, accordionStyles.content(), slots?.content)}
		>
			<div className={contentBody}>{children}</div>
		</DisclosurePanel>
	);
}
