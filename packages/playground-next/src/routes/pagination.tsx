import { Button, Pagination } from "@codeui/kit";
import { createSignal, For } from "solid-js";
import { DemoSectionRow } from "~/components/ui/DemoSection";

export default function PaginationDemo() {
	const [page, setPage] = createSignal(3);

	return (
		<>
			<h1 class={"title"}>Pagination</h1>

			<h2>Default</h2>

			<DemoSectionRow>
				<Pagination pages={100} />
			</DemoSectionRow>

			<h2>Controlled</h2>

			<div>Current page: {page()}</div>

			<DemoSectionRow>
				<Pagination initialPage={page()} page={page()} onChange={setPage} pages={100} />

				<Button size={"md"} theme={"tertiary"} onClick={() => setPage(3)}>
					Reset to 3
				</Button>
			</DemoSectionRow>

			<h2>Rounded</h2>

			<DemoSectionRow>
				<Pagination rounded pages={100} />
			</DemoSectionRow>

			<h2>Controlled</h2>

			<h2>Sizes</h2>

			<For each={["xs", "sm", "md", "lg", "xl"] as const}>
				{size => (
					<DemoSectionRow>
						<div
							style={{
								display: "flex",
								"align-items": "center",
								gap: "1rem",
								"flex-wrap": "wrap",
							}}
						>
							<span>{size}</span>
							<Pagination size={size} pages={10} />
						</div>
					</DemoSectionRow>
				)}
			</For>
		</>
	);
}
