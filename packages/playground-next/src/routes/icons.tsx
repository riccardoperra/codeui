import { For } from "solid-js";
import { icons } from "@codeui/kit";
import { DemoSectionRow } from "~/components/ui/DemoSection";

export default function IconsDemo() {
	return (
		<>
			<h1 class={"title"}>Icons</h1>

			<h3>Icons</h3>

			<DemoSectionRow>
				<div
					style={{
						display: "flex",
						"flex-wrap": "wrap",
						gap: "2rem",
					}}
				>
					<For each={Object.entries(icons)}>
						{([name, Icon]) => (
							<div>
								<h4>{name}</h4>
								<Icon />
							</div>
						)}
					</For>
				</div>
			</DemoSectionRow>

			<h3>Custom</h3>

			<DemoSectionRow>{<icons.CheckIcon size={"3.5em"} />}</DemoSectionRow>
		</>
	);
}
