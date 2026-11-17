import { Pagination } from "@codeui/kit";
import { createSignal } from "solid-js";
import "./showcase.css";

const perPage = 10;
const total = 118;

export default function Results() {
	const [page, setPage] = createSignal(3);
	return (
		<div class="showcase-stack" style={{ gap: "var(--cui-space-3)" }}>
			<p class="showcase-meta">
				Showing {(page() - 1) * perPage + 1}–{Math.min(page() * perPage, total)} of {total} invoices
			</p>
			<Pagination pages={Math.ceil(total / perPage)} page={page()} onChange={setPage} size="sm" />
		</div>
	);
}
