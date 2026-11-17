import { Pagination } from "@codeui/kit";
import { For } from "solid-js";
export default function Sizes() {
	return <For each={["xs", "sm", "md", "lg", "xl"] as const}>{size => <div><p>{size}</p><Pagination pages={3} size={size} rounded /></div>}</For>;
}
