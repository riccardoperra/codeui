"use client";

import {
	tabsContent,
	tabsHeader,
	tabsStyleProps,
	type TabsStyleOptions,
} from "@codeui/styles/tabs";
import { createContext, useContext, useMemo } from "react";
import {
	SelectionIndicator,
	Tab,
	TabList,
	TabPanel,
	Tabs as RACTabs,
	type TabListProps,
	type TabPanelProps,
	type TabProps,
	type TabsProps as RACTabsProps,
} from "react-aria-components";
import { useInputTracking, withClasses } from "./shared";

type TabsContextValue = Required<Pick<TabsStyleOptions, "variant" | "orientation">>;
const TabsContext = createContext<TabsContextValue>({
	variant: "default",
	orientation: "horizontal",
});

export type TabsProps = RACTabsProps & {
	/** `inline` draws a sliding indicator under the selected tab. Defaults to `default`. */
	variant?: TabsStyleOptions["variant"];
};

/** Tabs with their panels. On a phone, sections become tabs (Inkstone §8). */
export function Tabs({
	variant = "default",
	orientation = "horizontal",
	className,
	...props
}: TabsProps) {
	useInputTracking();
	const { class: base, ...appearance } = tabsStyleProps({ orientation, variant });
	const context = useMemo(() => ({ variant, orientation }), [variant, orientation]);
	return (
		<TabsContext.Provider value={context}>
			<RACTabs
				{...props}
				orientation={orientation}
				{...appearance}
				className={withClasses(className, base)}
			/>
		</TabsContext.Provider>
	);
}

export type TabsListProps<T> = TabListProps<T>;

export function TabsList<T extends object>({ className, ...props }: TabsListProps<T>) {
	const { orientation } = useContext(TabsContext);
	const { class: base, ...appearance } = tabsStyleProps.list({ orientation });
	return (
		<TabList<T> {...props} {...appearance} className={withClasses(className, base)} />
	);
}

export type TabsHeaderProps = TabProps;

/** A tab. The selected one reads in the primary tone; `inline` tabs also slide the indicator to it. */
export function TabsHeader({ className, children, ...props }: TabsHeaderProps) {
	const { variant, orientation } = useContext(TabsContext);
	const { class: indicator, ...appearance } = tabsStyleProps.indicator({ orientation });
	return (
		<Tab {...props} data-cui="tabs-header" className={withClasses(className, tabsHeader)}>
			{values => (
				<>
					{typeof children === "function" ? children(values) : children}
					{variant === "inline" && (
						<SelectionIndicator
							{...appearance}
							className={indicator}
							style={orientation === "vertical" ? { insetBlock: 0 } : { insetInline: 0 }}
						/>
					)}
				</>
			)}
		</Tab>
	);
}

export type TabsContentProps = TabPanelProps;

export function TabsContent({ className, ...props }: TabsContentProps) {
	return (
		<TabPanel
			{...props}
			data-cui="tabs-content"
			className={withClasses(className, tabsContent)}
		/>
	);
}
