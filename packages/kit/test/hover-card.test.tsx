import { cleanup, fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import {
	HoverCard,
	HoverCardContent,
	HoverCardGroup,
	HoverCardItem,
	HoverCardList,
	HoverCardTrigger,
} from "../src/components/HoverCard/HoverCard";
import { expectDismissed, press, tick } from "./helpers";

afterEach(cleanup);

const card = () => document.querySelector<HTMLElement>("[data-cui=hovercard-content]");

function renderCard(props: { openDelay?: number; closeDelay?: number } = {}) {
	render(() => (
		<HoverCardGroup>
			<HoverCard {...props}>
				<HoverCardTrigger href="#thread">Fix flaky test</HoverCardTrigger>
				<HoverCardContent>Opened 2 hours ago by Codex</HoverCardContent>
			</HoverCard>
		</HoverCardGroup>
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

it("opens on click without waiting for the delay", async () => {
	const trigger = renderCard();
	fireEvent.click(trigger);
	await waitFor(() => expect(card()).toBeInTheDocument(), { timeout: 200 });
});

it("opens on the first tap and follows the link on the next one", async () => {
	const trigger = renderCard();
	fireEvent.pointerDown(trigger, { pointerType: "touch" });
	const first = new MouseEvent("click", { bubbles: true, cancelable: true });
	trigger.dispatchEvent(first);
	expect(first.defaultPrevented).toBe(true);
	await waitFor(() => expect(card()).toBeInTheDocument());
	fireEvent.pointerDown(trigger, { pointerType: "touch" });
	const second = new MouseEvent("click", { bubbles: true, cancelable: true });
	trigger.dispatchEvent(second);
	expect(second.defaultPrevented).toBe(false);
	expect(card()).toBeInTheDocument();
});

it("sits on the right of the trigger by default", async () => {
	const trigger = renderCard({ openDelay: 0 });
	trigger.focus();
	await waitFor(() => {
		const content = card()!.getBoundingClientRect();
		const anchor = trigger.getBoundingClientRect();
		expect(content.left).toBeGreaterThanOrEqual(anchor.right);
	});
});

it("lists entries one per line with indent for nesting", async () => {
	render(() => (
		<HoverCard defaultOpen>
			<HoverCardTrigger href="#tasks">3 tasks</HoverCardTrigger>
			<HoverCardContent>
				<HoverCardList aria-label="Tasks">
					<HoverCardItem identifier="T-1">Parent</HoverCardItem>
					<HoverCardItem identifier="T-2" depth={1}>
						Child
					</HoverCardItem>
				</HoverCardList>
			</HoverCardContent>
		</HoverCard>
	));
	const list = await screen.findByRole("list", { name: "Tasks" });
	const items = screen.getAllByRole("listitem");
	expect(list).toHaveAttribute("data-cui", "hovercard-list");
	expect(items).toHaveLength(2);
	expect(items[1].style.getPropertyValue("--cui-hovercard-item-depth")).toBe("1");
	expect(items[0].style.getPropertyValue("--cui-hovercard-item-depth")).toBe("");
	expect(items[1].querySelector("[data-cui=hovercard-item-id]")).toHaveTextContent("T-2");
	expect(items[1].querySelector("[data-cui=hovercard-item-title]")).toHaveTextContent(
		"Child",
	);
});
