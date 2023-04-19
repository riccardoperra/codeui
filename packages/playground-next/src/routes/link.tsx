import { ButtonProps, buttonStyles, Link } from "@codeui/kit";
import { DemoSectionRow } from "~/components/ui/DemoSection";
import { For } from "solid-js";

export default function LinkDemo() {
	return (
		<>
			<h1 class={"title"}>Link</h1>

			<h2>Underline</h2>
			<DemoSectionRow>
				<Link link href={"https://codeimage.dev"} variant={"underline"}>
					External Link
				</Link>
			</DemoSectionRow>

			<h2>Link with Button styles</h2>
			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as ButtonProps["size"][]}>
					{size => (
						<Link
							href={"https://codeimage.dev"}
							class={buttonStyles.button({
								size: size,
								theme: "secondary",
								pill: true,
								variant: "ghost",
							})}
						>
							CodeImage
						</Link>
					)}
				</For>
			</DemoSectionRow>
		</>
	);
}
