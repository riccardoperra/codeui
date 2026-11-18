import { tabsStyleProps } from "@codeui/styles/tabs";
import "@codeui/styles/theme.css";
import "@codeui/styles/tabs.css";
import {
	Tabs as KTabs,
	TabsContentProps as KTabsContentProps,
	TabsIndicatorProps as KTabsIndicatorProps,
	TabsListProps as KTabsListProps,
	TabsRootProps as KTabsRootProps,
	TabsTriggerProps as KTabsTriggerProps,
} from "@kobalte/core/tabs";
import { mergeClasses } from "../../utils/css";
import * as styles from "./Tabs.css";
import { createContext, onMount, Show, splitProps, useContext, ValidComponent } from "solid-js";
import { trackInputModality } from "../../utils/modality";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

export type TabsProps<T extends ValidComponent = "div"> = KTabsRootProps<T> & {
	variant?: "inline" | "default";
};

const TabsContext = createContext<{
	variant: TabsProps["variant"];
}>({
	variant: tabsStyleProps()["data-variant"],
});

export function Tabs<T extends ValidComponent = "div">(props: PolymorphicProps<T, TabsProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", TabsProps<T>>, ["class", "variant"]);
	const variant = () => tabsStyleProps({ variant: local.variant })["data-variant"];
	const classes = () => mergeClasses(styles.tabsRoot, local.class);
	onMount(trackInputModality);

	return (
		<TabsContext.Provider
			value={{
				get variant() {
					return variant();
				},
			}}
		>
			<KTabs
				data-cui={"tabs"}
				data-variant={variant()}
				{...others}
				class={classes()}
			/>
		</TabsContext.Provider>
	);
}

export type TabsListProps<T extends ValidComponent = "div"> = KTabsListProps<T>;

export function TabsListPart<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TabsListProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", TabsListProps>, ["class"]);
	return <KTabs.List {...others} class={mergeClasses(styles.tabsList, local.class)} />;
}

export function TabsList<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TabsListProps<T>>,
) {
	const context = useContext(TabsContext);
	const [local, others] = splitProps(props as PolymorphicProps<"div", TabsListProps>, ["children"]);
	return (
		<TabsListPart {...others}>
			{local.children}
			<Show when={context.variant === "inline"}>
				<TabsIndicator />
			</Show>
		</TabsListPart>
	);
}

export type TabsTriggerProps<T extends ValidComponent = "button"> = KTabsTriggerProps<T>;

export function TabsHeader<T extends ValidComponent = "button">(props: PolymorphicProps<T, TabsTriggerProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"button", TabsTriggerProps>, ["class"]);
	const classes = () => mergeClasses(styles.tabsHeader, local.class);

	return <KTabs.Trigger {...others} class={classes()} />;
}

export type TabsContentProps<T extends ValidComponent = "div"> = KTabsContentProps<T>;

export function TabsContent<T extends ValidComponent = "div">(props: PolymorphicProps<T, TabsContentProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", TabsContentProps>, ["class"]);
	const classes = () => mergeClasses(styles.tabsContent, local.class);

	return <KTabs.Content {...others} class={classes()} />;
}

export type TabsIndicatorProps<T extends ValidComponent = "div"> = KTabsIndicatorProps<T>;

export function TabsIndicator<T extends ValidComponent = "div">(props: PolymorphicProps<T, TabsIndicatorProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", TabsIndicatorProps>, ["class"]);
	return (
		<KTabs.Indicator {...others} class={mergeClasses(styles.indicator, local.class)} />
	);
}
