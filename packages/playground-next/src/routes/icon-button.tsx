import { For } from "solid-js";
import { Button, ButtonProps, IconButton } from "@codeui/kit";
import { DemoSectionRow } from "~/components/ui/DemoSection";
import { SearchIcon } from "~/components/icons/SearchIcon";

export default function ButtonDemo() {
	return (
		<>
			<h1 class={"title"}>Icon Button</h1>

			<h2>Sizes</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as ButtonProps["size"][]}>
					{size => (
						<IconButton aria-label="Search" size={size} theme={"primary"}>
							<SearchIcon />
						</IconButton>
					)}
				</For>
			</DemoSectionRow>

			<h2>Themes</h2>

			<DemoSectionRow>
				<For
					each={
						[
							"primary",
							"secondary",
							"tertiary",
							"negative",
							"caution",
						] as ButtonProps["theme"][]
					}
				>
					{variant => (
						<IconButton aria-label="Search" size={"md"} theme={variant}>
							<SearchIcon />
						</IconButton>
					)}
				</For>

				<IconButton aria-label="Search" size={"md"} theme={"primary"} disabled>
					<SearchIcon />
				</IconButton>
			</DemoSectionRow>

			<h2>Rounded</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as ButtonProps["size"][]}>
					{size => (
						<IconButton aria-label="Search" size={size} theme={"secondary"} pill>
							<SearchIcon />
						</IconButton>
					)}
				</For>
			</DemoSectionRow>
		</>
	);
}
