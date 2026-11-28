import "@codeui/styles/theme.css";
import "@codeui/styles/resizable.css";
import { resizableParts, type ResizableClasses } from "@codeui/styles/resizable";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	Resizable as KResizable,
	type HandleProps as KHandleProps,
	type PanelProps as KPanelProps,
	type ResizableSize,
	type RootChildrenProps,
	type RootProps as KRootProps,
} from "@kobalte/core/resizable";
import { createContext, omit, onCleanup, useContext } from "solid-js";
import { type ValidComponent } from "@solidjs/web";
import { mergeClasses } from "../../utils/css";
import * as styles from "./Resizable.css";

export {
	resizableParts,
	resizableStyles,
	type ResizablePart,
	type ResizableClasses,
	type ResizableOrientation,
	type ResizableStyles,
} from "@codeui/styles/resizable";
export type { ResizableSize, ResizeStrategy } from "@kobalte/core/resizable";

export type ResizableProps<T extends ValidComponent = "div"> = KRootProps<T> & {
	class?: string;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: Pick<ResizableClasses, "root">;
};

/** Lays out `ResizablePanel`s in a row or a column, split by `ResizableHandle`s. */
export function Resizable<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ResizableProps<T>>,
) {
	const local = props as PolymorphicProps<"div", ResizableProps>;
	const others = omit(local, "class", "classes", "ref", "children");
	let element: HTMLElement | undefined;
	const layout: PanelLayout = {
		size: () =>
			(local.orientation === "vertical" ? element?.offsetHeight : element?.offsetWidth) ?? 0,
		panels: new Set(),
	};
	return (
		<PanelLayoutContext value={layout}>
			<KResizable
				{...others}
				ref={[(el: HTMLElement) => (element = el), local.ref]}
				data-cui={resizableParts.root}
				class={mergeClasses(local.classes?.root, local.class)}
			>
				{/* Kobalte reads `children` twice, which would render every panel twice. A function is read once. */}
				{(state: RootChildrenProps) => {
					const children = local.children;
					return typeof children === "function" ? children(state) : children;
				}}
			</KResizable>
		</PanelLayoutContext>
	);
}

/**
 * Kobalte alpha.5 sizes each panel when it registers, from an effect. Two gaps
 * follow under Solid 2: a pixel `initialSize` divides by a root size that still
 * reads 0, and a panel without one takes 0.5 instead of the space left over.
 * The panels join this list as they render, so each can hand Kobalte a
 * fraction of the measured root when Kobalte reads it.
 */
type PanelLayout = {
	size: () => number;
	panels: Set<() => ResizableSize | undefined>;
};

const PanelLayoutContext = createContext<PanelLayout>({ size: () => 0, panels: new Set() });

function toFraction(size: ResizableSize, total: number) {
	if (typeof size === "number") return size;
	return total ? parseFloat(size) / total : undefined;
}

export type ResizablePanelProps<T extends ValidComponent = "div"> = KPanelProps<T> & {
	class?: string;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: Pick<ResizableClasses, "panel">;
};

/** A pane whose size is a fraction of the root or a `"240px"` string. */
export function ResizablePanel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ResizablePanelProps<T>>,
) {
	const local = props as PolymorphicProps<"div", ResizablePanelProps>;
	const others = omit(local, "class", "classes", "initialSize");
	const layout = useContext(PanelLayoutContext);
	const declared = () => local.initialSize;
	layout.panels.add(declared);
	onCleanup(() => layout.panels.delete(declared));
	const initialSize = () => {
		const total = layout.size();
		if (local.initialSize !== undefined) return toFraction(local.initialSize, total) ?? local.initialSize;
		let used = 0;
		let shares = 0;
		for (const panel of layout.panels) {
			const size = panel();
			if (size === undefined) shares++;
			else {
				const fraction = toFraction(size, total);
				if (fraction === undefined) return undefined;
				used += fraction;
			}
		}
		return Math.max(0, 1 - used) / shares;
	};
	return (
		<KResizable.Panel
			{...others}
			initialSize={initialSize()}
			data-cui={resizableParts.panel}
			class={mergeClasses(local.classes?.panel, local.class)}
		/>
	);
}

export type ResizableHandleProps<T extends ValidComponent = "button"> = KHandleProps<T> & {
	class?: string;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: Pick<ResizableClasses, "handle">;
};

/** The separator between two panels. Drag it, or focus it and use the arrow keys. */
export function ResizableHandle<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, ResizableHandleProps<T>>,
) {
	const local = props as PolymorphicProps<"button", ResizableHandleProps>;
	const others = omit(local, "class", "classes");
	return (
		<KResizable.Handle
			{...others}
			data-cui={resizableParts.handle}
			class={mergeClasses(styles.handle(), local.classes?.handle, local.class)}
		/>
	);
}
