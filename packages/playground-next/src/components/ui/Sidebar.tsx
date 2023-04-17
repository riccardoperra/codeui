import { ParentProps } from "solid-js";
import * as styles from "./Sidebar.css";

export function Sidebar(props: ParentProps) {
	return <div class={styles.sidebar}>{props.children}</div>;
}

export function SidebarItem(props: ParentProps) {
	return <li class={styles.sidebarItem}>{props.children}</li>;
}
