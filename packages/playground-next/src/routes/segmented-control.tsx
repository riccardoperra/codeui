import { SegmentedControl, SegmentedControlItem } from "@codeui/kit";
import { DemoSectionRow } from "~/components/ui/DemoSection";
import { For } from "solid-js";
import { ClipboardIcon } from "~/components/icons/ClipboardIcon";

export default function SegmentedControlDemo() {
	return (
		<>
			<h1 class={"title"}>Segmented Control</h1>

			<h2>Solid style</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as const}>
					{size => (
						<SegmentedControl defaultValue={"1"} size={size}>
							<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
							<SegmentedControlItem value={"2"}>Center</SegmentedControlItem>
							<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
						</SegmentedControl>
					)}
				</For>
			</DemoSectionRow>

			<h2>Bordered style</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as const}>
					{size => (
						<SegmentedControl defaultValue={"1"} size={size} variant={"bordered"}>
							<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
							<SegmentedControlItem value={"2"}>Center</SegmentedControlItem>
							<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
						</SegmentedControl>
					)}
				</For>
			</DemoSectionRow>

			<h2>Pill style</h2>

			<DemoSectionRow>
				<SegmentedControl defaultValue={"1"} size={"md"} variant={"solid"} pill>
					<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
					<SegmentedControlItem value={"2"}>Center</SegmentedControlItem>
					<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
				</SegmentedControl>
				<SegmentedControl defaultValue={"1"} size={"md"} variant={"bordered"} pill>
					<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
					<SegmentedControlItem value={"2"}>Center</SegmentedControlItem>
					<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
				</SegmentedControl>
			</DemoSectionRow>

			<h2>Theme</h2>

			<DemoSectionRow>
				<For each={["neutral", "primary"] as const}>
					{theme => (
						<SegmentedControl
							defaultValue={"1"}
							size={"md"}
							variant={"solid"}
							theme={theme}
						>
							<SegmentedControlItem value={"1"}>Left</SegmentedControlItem>
							<SegmentedControlItem value={"2"}>Center</SegmentedControlItem>
							<SegmentedControlItem value={"3"}>Right</SegmentedControlItem>
						</SegmentedControl>
					)}
				</For>
			</DemoSectionRow>

			<h2>With Icons</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as const}>
					{size => (
						<SegmentedControl defaultValue={"1"} size={size}>
							<SegmentedControlItem value={"1"} aria-label={"Icon 1"}>
								<ClipboardIcon />
							</SegmentedControlItem>
							<SegmentedControlItem value={"2"} aria-label={"Icon 2"}>
								<ClipboardIcon />
							</SegmentedControlItem>
							<SegmentedControlItem value={"3"} aria-label={"Icon 3"}>
								<ClipboardIcon />
							</SegmentedControlItem>
						</SegmentedControl>
					)}
				</For>
			</DemoSectionRow>

			<h2>Adapt to container size</h2>

			<DemoSectionRow>
				<div style={{ width: "300px", height: "80px", background: "red" }}>
					<SegmentedControl defaultValue={"1"} size={"md"} fluid>
						<SegmentedControlItem value={"1"} aria-label={"Icon 1"}>
							<ClipboardIcon />
						</SegmentedControlItem>
						<SegmentedControlItem value={"2"} aria-label={"Icon 2"}>
							<ClipboardIcon />
						</SegmentedControlItem>
					</SegmentedControl>
				</div>
			</DemoSectionRow>

			<h2>Auto width</h2>
			{() => {
				return (
					<DemoSectionRow>
						<SegmentedControl defaultValue={"1"} size={"md"} autoWidth>
							<SegmentedControlItem value={"24"}>24</SegmentedControlItem>
							<SegmentedControlItem value={"32"}>32</SegmentedControlItem>
							<SegmentedControlItem value={"64"}>64</SegmentedControlItem>
							<SegmentedControlItem value={"128"}>128</SegmentedControlItem>
						</SegmentedControl>
					</DemoSectionRow>
				);
			}}

			<h2>Disabled tab</h2>

			<DemoSectionRow>
				<SegmentedControl defaultValue={"1"} size={"md"} disabled>
					<SegmentedControlItem value={"1"} aria-label={"Icon 1"}>
						<ClipboardIcon />
					</SegmentedControlItem>
					<SegmentedControlItem value={"2"} aria-label={"Icon 2"}>
						<ClipboardIcon />
					</SegmentedControlItem>
					<SegmentedControlItem value={"3"} aria-label={"Icon 3"}>
						<ClipboardIcon />
					</SegmentedControlItem>
				</SegmentedControl>

				<SegmentedControl defaultValue={"1"} size={"md"}>
					<SegmentedControlItem value={"1"} aria-label={"Icon 1"}>
						<ClipboardIcon />
					</SegmentedControlItem>
					<SegmentedControlItem value={"2"} disabled aria-label={"Icon 2"}>
						<ClipboardIcon />
					</SegmentedControlItem>
					<SegmentedControlItem value={"3"} aria-label={"Icon 3"}>
						<ClipboardIcon />
					</SegmentedControlItem>
				</SegmentedControl>
			</DemoSectionRow>

			<DemoSectionRow>
				<SegmentedControl defaultValue={"1"} size={"md"} variant={"bordered"} disabled>
					<SegmentedControlItem value={"1"} aria-label={"Icon 1"}>
						<ClipboardIcon />
					</SegmentedControlItem>
					<SegmentedControlItem value={"2"} aria-label={"Icon 2"}>
						<ClipboardIcon />
					</SegmentedControlItem>
					<SegmentedControlItem value={"3"} aria-label={"Icon 3"}>
						<ClipboardIcon />
					</SegmentedControlItem>
				</SegmentedControl>

				<SegmentedControl defaultValue={"1"} size={"md"} variant={"bordered"}>
					<SegmentedControlItem value={"1"} aria-label={"Icon 1"}>
						<ClipboardIcon />
					</SegmentedControlItem>
					<SegmentedControlItem value={"2"} disabled aria-label={"Icon 2"}>
						<ClipboardIcon />
					</SegmentedControlItem>
					<SegmentedControlItem value={"3"} aria-label={"Icon 3"}>
						<ClipboardIcon />
					</SegmentedControlItem>
				</SegmentedControl>
			</DemoSectionRow>
		</>
	);
}
