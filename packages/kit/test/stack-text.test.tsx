import { cleanup, render, screen, fireEvent } from "solid-testing-library";
import { createSignal } from "solid-js";
import { Stack } from "../src/components/Stack/Stack";
import { Text } from "../src/components/Text/Text";
import * as S from "../src/parts/stack";
import * as T from "../src/parts/text";
afterEach(cleanup);
it("renders semantic elements, rich content, native attributes and merged classes", () => {
	let heading: HTMLHeadingElement | undefined;
	render(() => (
		<Stack as="section" aria-label="Summary" class="custom" classes={{ root: "slot" }}>
			<Text as="h2" ref={heading} size="xl" weight="semibold" tone="label">
				<em>Export</em> settings
			</Text>
		</Stack>
	));
	expect(screen.getByRole("region", { name: "Summary" })).toHaveClass("custom", "slot");
	expect(screen.getByRole("heading", { level: 2 })).toBe(heading);
	expect(heading?.querySelector("em")).toHaveTextContent("Export");
	expect(heading).toHaveAttribute("data-size", "xl");
});
it("updates layout and typography attributes reactively and keeps inline styles", () => {
	const [wide, setWide] = createSignal(false);
	render(() => (
		<>
			<button onClick={() => setWide(true)}>Change</button>
			<Stack
				data-testid="stack"
				gap={wide() ? "32" : "2"}
				direction={wide() ? "row" : "column"}
				align="center"
				justify="between"
				wrap
				style={{ opacity: "0.8" }}
			>
				<Text tone={wide() ? "danger" : "default"}>Status</Text>
			</Stack>
		</>
	));
	const stack = screen.getByTestId("stack");
	expect(stack).toHaveAttribute("data-gap", "2");
	expect(stack).toHaveAttribute("data-direction", "column");
	expect(stack).toHaveAttribute("data-align", "center");
	expect(stack).toHaveAttribute("data-justify", "between");
	fireEvent.click(screen.getByRole("button"));
	expect(stack).toHaveAttribute("data-gap", "32");
	expect(stack.style.getPropertyValue("--cui-stack-gap")).toBe("");
	expect(stack.style.opacity).toBe("0.8");
	expect(stack).toHaveAttribute("data-direction", "row");
	expect(stack).toHaveAttribute("data-wrap", "true");
	const status = screen.getByText("Status");
	expect(status).toHaveAttribute("data-tone", "danger");
});
it("exposes root styles and defaults and preserves string styles", () => {
	render(() => (
		<S.Root style="flex:1" data-testid="stack">
			<T.Root>Default</T.Root>
		</S.Root>
	));
	const stack = screen.getByTestId("stack");
	expect(stack).toHaveAttribute("data-cui", S.stackParts.root);
	expect(stack).toHaveAttribute("data-gap", "2");
	expect(stack).toHaveAttribute("data-wrap", "false");
	expect(stack.style.flex).toBe("1");
	expect(stack).toHaveAttribute("data-align", "stretch");
	expect(screen.getByText("Default").tagName).toBe("SPAN");
	expect(screen.getByText("Default")).toHaveAttribute("data-size", "sm");
});
