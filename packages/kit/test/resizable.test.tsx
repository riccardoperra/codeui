import { cleanup, render, screen, waitFor } from "@solidjs/testing-library";
import { Resizable, ResizableHandle, ResizablePanel } from "../src/components/Resizable/Resizable";
import { press, tick } from "./helpers";

afterEach(cleanup);

function renderSidebar(orientation: "horizontal" | "vertical" = "horizontal") {
	render(() => (
		<Resizable
			orientation={orientation}
			style={{ width: "800px", height: "400px" }}
			keyboardDelta="40px"
		>
			<ResizablePanel initialSize="200px" minSize="160px" maxSize="320px" data-testid="sidebar">
				Threads
			</ResizablePanel>
			<ResizableHandle aria-label="Resize sidebar" />
			<ResizablePanel>Content</ResizablePanel>
		</Resizable>
	));
	return {
		handle: screen.getByRole("separator", { name: "Resize sidebar" }),
		sidebar: screen.getByTestId("sidebar"),
	};
}

const width = (element: HTMLElement) => Math.round(element.getBoundingClientRect().width);
const height = (element: HTMLElement) => Math.round(element.getBoundingClientRect().height);

it("resizes from the keyboard and stops at minSize and maxSize", async () => {
	const { handle, sidebar } = renderSidebar();
	await waitFor(() => expect(width(sidebar)).toBe(200));
	expect(handle).toHaveAttribute("data-orientation", "horizontal");
	handle.focus();
	press("ArrowRight");
	await tick();
	expect(width(sidebar)).toBe(240);
	press("End");
	await tick();
	expect(width(sidebar)).toBe(320);
	press("ArrowRight");
	await tick();
	expect(width(sidebar)).toBe(320);
	press("Home");
	await tick();
	expect(width(sidebar)).toBe(160);
});

it("resizes a column with the up and down arrows", async () => {
	const { handle, sidebar } = renderSidebar("vertical");
	await waitFor(() => expect(height(sidebar)).toBe(200));
	expect(handle).toHaveAttribute("data-orientation", "vertical");
	handle.focus();
	press("ArrowDown");
	await tick();
	expect(height(sidebar)).toBe(240);
	press("ArrowUp");
	await tick();
	expect(height(sidebar)).toBe(200);
});

it("fills the root: the handle takes no space and a panel without initialSize takes the rest", async () => {
	const { handle, sidebar } = renderSidebar();
	const main = screen.getByText("Content");
	await waitFor(() => expect(width(sidebar)).toBe(200));
	expect(width(main)).toBe(600);
	expect(Math.round(handle.getBoundingClientRect().left + handle.getBoundingClientRect().width / 2)).toBe(
		Math.round(sidebar.getBoundingClientRect().right),
	);
});
