import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { Tooltip } from "../src/components/Tooltip/Tooltip";
import { Provider as TooltipProvider } from "../src/parts/tooltip";
import { tick } from "./helpers";

afterEach(cleanup);

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// A synthetic pointerenter stays in this test's frame. userEvent.hover moves the shared
// browser pointer, which can open a tooltip in another test file running beside this one.
function hover(name: string) {
	const trigger = screen.getByRole("button", { name }).closest('[data-cui="tooltip-trigger"]')!;
	fireEvent(trigger, new PointerEvent("pointerenter", { pointerType: "mouse" }));
}

it("opens 700ms after hover with the neutral fill by default", async () => {
	render(() => (
		<Tooltip content="Copy to clipboard">
			<button>Copy</button>
		</Tooltip>
	));
	hover("Copy");
	await wait(450);
	expect(screen.queryByRole("tooltip")).toBeNull();
	await wait(450);
	expect(screen.getByRole("tooltip")).toHaveAttribute("data-variant", "secondary");
});

it("waits for the provider's open delay on hover", async () => {
	render(() => (
		<TooltipProvider openDelay={100}>
			<Tooltip content="Copy to clipboard">
				<button>Copy</button>
			</Tooltip>
		</TooltipProvider>
	));
	hover("Copy");
	await wait(300);
	expect(screen.getByRole("tooltip")).toHaveTextContent("Copy to clipboard");
});

it("uses the provider's variant unless the tooltip sets its own", async () => {
	render(() => (
		<TooltipProvider variant="primary">
			<Tooltip content="Brand">
				<button>First</button>
			</Tooltip>
			<Tooltip content="Neutral" variant="secondary">
				<button>Second</button>
			</Tooltip>
		</TooltipProvider>
	));
	screen.getByRole("button", { name: "First" }).focus();
	await tick();
	expect(screen.getByRole("tooltip")).toHaveAttribute("data-variant", "primary");
	screen.getByRole("button", { name: "Second" }).focus();
	await tick();
	expect(screen.getByRole("tooltip", { name: "Neutral" })).toHaveAttribute(
		"data-variant",
		"secondary",
	);
});
