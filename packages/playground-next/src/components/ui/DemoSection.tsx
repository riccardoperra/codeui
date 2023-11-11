import { section, row } from "./DemoSection.css";
import { ParentProps } from "solid-js";

export function DemoSection(props: ParentProps) {
	return <div class={section}>{props.children}</div>;
}

export function DemoSectionRow(props: ParentProps) {
	return <div class={row}>{props.children}</div>;
}

export function DemoSectionRowInline(props: ParentProps) {
	return <div class={row}>{props.children}</div>;
}
