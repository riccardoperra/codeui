import { cleanup, render, screen } from "@solidjs/testing-library";
import { userEvent } from "vitest/browser";
import { Tooltip } from "../src/components/Tooltip/Tooltip";
import { Provider as TooltipProvider } from "../src/parts/tooltip";
import { tick } from "./helpers";

afterEach(cleanup);

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

it("opens 700ms after hover with the neutral fill by default", async () => {
	render(() => (
		<Tooltip content="Copy to clipboard">
			<button>Copy</button>
		</Tooltip>
	));
	await userEvent.hover(screen.getByRole("button", { name: "Copy" }));
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
	await userEvent.hover(screen.getByRole("button", { name: "Copy" }));
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
