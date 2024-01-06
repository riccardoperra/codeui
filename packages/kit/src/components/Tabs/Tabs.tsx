import { Tabs as KTabs } from "@kobalte/core";
import { mergeClasses } from "../../utils/css";
import * as styles from "./Tabs.css";
import { createContext, Show, splitProps, useContext } from "solid-js";

type TabsProps = KTabs.TabsRootProps & {
	theme?: "inline" | "default";
};

const TabsContext = createContext<{
	theme: TabsProps["theme"];
}>({
	theme: "default",
});

export function Tabs(props: TabsProps) {
	const [local, others] = splitProps(props, ["class", "theme"]);
	const classes = () => mergeClasses(styles.tabsRoot, local.class);

	return (
		<TabsContext.Provider
			value={{
				theme: local.theme,
			}}
		>
			<KTabs.Root
				data-cui={"tabs"}
				data-tabs-theme={local.theme}
				{...others}
				class={classes()}
			/>
		</TabsContext.Provider>
	);
}

type TabsListProps = KTabs.TabsListProps;

export function TabsList(props: TabsListProps) {
	const context = useContext(TabsContext);
	const [local, others] = splitProps(props, ["class", "children"]);
	const classes = () => mergeClasses(styles.tabsList, local.class);

	return (
		<KTabs.List {...others} class={classes()}>
			{local.children}
			<Show when={context.theme === "inline"}>
				<TabsIndicator />
			</Show>
		</KTabs.List>
	);
}

type TabsTriggerProps = KTabs.TabsTriggerProps;

export function TabsHeader(props: TabsTriggerProps) {
	const [local, others] = splitProps(props, ["class"]);
	const classes = () => mergeClasses(styles.tabsHeader, local.class);

	return <KTabs.Trigger {...others} class={classes()} />;
}

type TabsContentProps = KTabs.TabsContentProps;

export function TabsContent(props: TabsContentProps) {
	const [local, others] = splitProps(props, ["class"]);
	const classes = () => mergeClasses(styles.tabsContent, local.class);

	return <KTabs.Content {...others} class={classes()} />;
}

type TabsIndicatorProps = KTabs.TabsIndicatorProps;

export function TabsIndicator(props: TabsIndicatorProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<KTabs.Indicator {...others} class={mergeClasses(styles.indicator, local.class)} />
	);
}
