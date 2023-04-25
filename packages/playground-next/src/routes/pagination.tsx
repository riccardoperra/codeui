import { For } from "solid-js";
import { DemoSectionRow } from "~/components/ui/DemoSection";
import { Pagination } from "../../../kit/src/components/Pagination/Pagination";

export default function PaginationDemo() {
	return (
		<>
			<h1 class={"title"}>Pagination</h1>

			<h2>Default</h2>

			<DemoSectionRow>
				<Pagination pages={100} />
			</DemoSectionRow>

			<h2>Rounded</h2>

			<DemoSectionRow>
				<Pagination rounded pages={100} />
			</DemoSectionRow>

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
