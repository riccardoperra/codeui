import { cleanup, render, screen } from "@solidjs/testing-library";
import { userEvent } from "vitest/browser";
import { Tooltip } from "../src/components/Tooltip/Tooltip";
import { Provider as TooltipProvider } from "../src/parts/tooltip";
import { tick } from "./helpers";

afterEach(cleanup);

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

it("waits for the provider's open delay on hover", async () => {
	render(() => (
		<TooltipProvider openDelay={600}>
			<Tooltip content="Copy to clipboard">
				<button>Copy</button>
			</Tooltip>
		</TooltipProvider>
	));
	await userEvent.hover(screen.getByRole("button", { name: "Copy" }));
	await wait(350);
	expect(screen.queryByRole("tooltip")).toBeNull();
	await wait(450);
	expect(screen.getByRole("tooltip")).toHaveTextContent("Copy to clipboard");
});

it("uses the provider's variant unless the tooltip sets its own", async () => {
	render(() => (
		<TooltipProvider variant="secondary">
			<Tooltip content="Neutral">
				<button>First</button>
			</Tooltip>
			<Tooltip content="Brand" variant="primary">
				<button>Second</button>
			</Tooltip>
		</TooltipProvider>
	));
	screen.getByRole("button", { name: "First" }).focus();
	await tick();
	expect(screen.getByRole("tooltip")).toHaveAttribute("data-variant", "secondary");
	screen.getByRole("button", { name: "Second" }).focus();
	await tick();
	expect(screen.getByRole("tooltip", { name: "Brand" })).toHaveAttribute("data-variant", "primary");
});
