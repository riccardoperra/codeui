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
import { createContext, onSettled, Show, useContext, omit } from "solid-js";
import { ValidComponent } from "@solidjs/web";
import { trackInputModality } from "../../utils/modality";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { callHandler } from "@kobalte/utils";
import { allowEscapeToBubble } from "../../utils/escape";

export type TabsProps<T extends ValidComponent = "div"> = KTabsRootProps<T> & {
	variant?: "inline" | "default";
};

const TabsContext = createContext<{
	variant: TabsProps["variant"];
}>({
	variant: tabsStyleProps()["data-variant"],
});

export function Tabs<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TabsProps<T>>,
) {
	const local = props as PolymorphicProps<"div", TabsProps<T>>;
	const others = omit(local, "class", "variant");
	const variant = () => tabsStyleProps({ variant: local.variant })["data-variant"];
	const classes = () => mergeClasses(styles.tabsRoot, local.class);
	onSettled(trackInputModality);

	return (
		<TabsContext
			value={{
				get variant() {
					return variant();
				},
			}}
		>
			<KTabs data-cui={"tabs"} data-variant={variant()} {...others} class={classes()} />
		</TabsContext>
	);
}

export type TabsListProps<T extends ValidComponent = "div"> = KTabsListProps<T>;

export function TabsListPart<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TabsListProps<T>>,
) {
	const local = props as PolymorphicProps<"div", TabsListProps>;
	const others = omit(local, "class", "onKeyDown");
	return (
		<KTabs.List
			{...others}
			class={mergeClasses(styles.tabsList, local.class)}
			onKeyDown={event => {
				callHandler(event, local.onKeyDown);
				// Tabs always keep an active selection, so Escape belongs to the enclosing layer.
				allowEscapeToBubble(event);
			}}
		/>
	);
}

export function TabsList<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TabsListProps<T>>,
) {
	const context = useContext(TabsContext);
	const local = props as PolymorphicProps<"div", TabsListProps>;
	const others = omit(local, "children");
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

export function TabsHeader<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, TabsTriggerProps<T>>,
) {
	const local = props as PolymorphicProps<"button", TabsTriggerProps>;
	const others = omit(local, "class");
	const classes = () => mergeClasses(styles.tabsHeader, local.class);

	return <KTabs.Trigger {...others} class={classes()} />;
}

export type TabsContentProps<T extends ValidComponent = "div"> = KTabsContentProps<T>;

export function TabsContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TabsContentProps<T>>,
) {
	const local = props as PolymorphicProps<"div", TabsContentProps>;
	const others = omit(local, "class");
	const classes = () => mergeClasses(styles.tabsContent, local.class);

	return <KTabs.Content {...others} class={classes()} />;
}

export type TabsIndicatorProps<T extends ValidComponent = "div"> = KTabsIndicatorProps<T>;

export function TabsIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TabsIndicatorProps<T>>,
) {
	const local = props as PolymorphicProps<"div", TabsIndicatorProps>;
	const others = omit(local, "class");
	return (
		<KTabs.Indicator {...others} class={mergeClasses(styles.indicator, local.class)} />
	);
}
