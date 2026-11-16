import { createSignal } from "solid-js";
import { Pagination } from "@codeui/kit";

export default function PaginationDemo() {
	const [page, setPage] = createSignal(1);
	return <Pagination pages={12} page={page()} onChange={setPage} />;
}
