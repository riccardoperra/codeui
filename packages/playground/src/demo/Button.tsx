import { For } from "solid-js";
import { Button, ButtonProps, IconButton } from "@codeui/kit";
import { DemoSectionRow } from "../ui/DemoSection";

function Clipboard() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			width={"1.1em"}
			height={"1.1em"}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
			/>
		</svg>
	);
}

function SearchIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			width={"1.1em"}
			height={"1.1em"}
		>
			<path
				fill-rule="evenodd"
				d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
				clip-rule="evenodd"
			/>
		</svg>
	);
}

export function ButtonDemo() {
	return (
		<>
			<h1 class={"title"}>Button</h1>

			<h2>Sizes</h2>
			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as ButtonProps["size"][]}>
					{size => (
						<Button size={size} theme={"primary"}>
							Button
						</Button>
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
						<Button size={"md"} theme={variant}>
							Button
						</Button>
					)}
				</For>

				<Button size={"md"} theme={"primary"} isDisabled>
					Disabled
				</Button>
			</DemoSectionRow>

			<h2>Left icon</h2>
			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as ButtonProps["size"][]}>
					{size => (
						<Button leftIcon={<Clipboard />} size={size} theme={"secondary"}>
							Copy
						</Button>
					)}
				</For>
			</DemoSectionRow>

			<h2>Rounded</h2>
			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as ButtonProps["size"][]}>
					{size => (
						<Button size={size} theme={"secondary"} pill>
							Button
						</Button>
					)}
				</For>
			</DemoSectionRow>

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

				<IconButton aria-label="Search" size={"md"} theme={"primary"} isDisabled>
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
