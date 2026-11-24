import { cleanup, fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../src/components/HoverCard/HoverCard";
import { expectDismissed, press, tick } from "./helpers";

afterEach(cleanup);

const card = () => document.querySelector<HTMLElement>("[data-cui=hovercard-content]");

function renderCard(props: { openDelay?: number; closeDelay?: number } = {}) {
	render(() => (
		<HoverCard {...props}>
			<HoverCardTrigger href="#thread">Fix flaky test</HoverCardTrigger>
			<HoverCardContent>Opened 2 hours ago by Codex</HoverCardContent>
		</HoverCard>
	));
	return screen.getByRole("link", { name: "Fix flaky test" });
}

it("opens on keyboard focus without motion and closes on Escape, keeping focus", async () => {
	const trigger = renderCard({ openDelay: 0 });
	trigger.focus();
	await waitFor(() => expect(card()).toHaveTextContent("Opened 2 hours ago by Codex"));
	const content = card()!;
	expect(content).toHaveAttribute("data-motion", "none");
	expect(document.activeElement).toBe(trigger);
	press("Escape");
	await tick();
	await expectDismissed(content);
	expect(document.activeElement).toBe(trigger);
});

it("opens when the pointer rests on the trigger", async () => {
	const trigger = renderCard({ openDelay: 0 });
	fireEvent.pointerMove(document, { pointerType: "mouse" });
	fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
	await waitFor(() => expect(card()).toBeInTheDocument());
	expect(card()).not.toHaveAttribute("data-motion");
});

it("waits 500ms before opening by default", async () => {
	const trigger = renderCard();
	trigger.focus();
	await new Promise(resolve => setTimeout(resolve, 300));
	expect(card()).toBeNull();
	await waitFor(() => expect(card()).toBeInTheDocument(), { timeout: 1000 });
});
