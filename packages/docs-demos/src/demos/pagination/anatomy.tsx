import { Pagination } from "@codeui/kit";
import { createSignal } from "solid-js";

export default function PaginationAnatomy() {
	const [page, setPage] = createSignal(2);
	return <Pagination pages={3} page={page()} onChange={setPage} />;
}
