import { Pagination } from "@codeui/kit";
import { createSignal } from "solid-js";
export default function Basic() {
	const [page, setPage] = createSignal(1);
	return <div><Pagination pages={12} page={page()} onChange={setPage} /><p>Snippet page {page()} of 12</p></div>;
}
