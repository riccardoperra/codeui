import { cleanup, fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { createSignal, Show } from "solid-js";
import {
	HoverCard,
	HoverCardContent,
	HoverCardGroup,
	HoverCardTrigger,
} from "../src/components/HoverCard/HoverCard";
import { press } from "./helpers";

const cards = () => [
	...document.querySelectorAll<HTMLElement>("[data-cui=hovercard-content]"),
];
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cards outside a group share one page surface. Let the previous test's card leave
// and its skip window pass, so each test starts from a closed page card.
beforeEach(async () => {
	await waitFor(() => expect(cards()).toHaveLength(0));
	await sleep(450);
});
afterEach(cleanup);

function hover(trigger: HTMLElement, point?: { x: number; y: number }) {
	const rect = trigger.getBoundingClientRect();
	const { x, y } = point ?? { x: rect.left + 2, y: rect.top + 2 };
	fireEvent.pointerMove(document, { pointerType: "mouse" });
	fireEvent.pointerEnter(trigger, { pointerType: "mouse", clientX: x, clientY: y });
}

function Pair(props: { onA?: (open: boolean) => void; delayB?: number }) {
	return (
		<div
			style={{ display: "flex", "flex-direction": "column", gap: "8px", width: "160px" }}
		>
			<HoverCard openDelay={0} onOpenChange={props.onA}>
				<HoverCardTrigger href="#a" style={{ display: "block" }}>
					Thread A
				</HoverCardTrigger>
				<HoverCardContent id="card-a">
					<div style={{ height: "160px" }}>Details of A</div>
				</HoverCardContent>
			</HoverCard>
			<HoverCard openDelay={props.delayB ?? 1000}>
				<HoverCardTrigger href="#b" style={{ display: "block" }}>
					Thread B
				</HoverCardTrigger>
				<HoverCardContent id="card-b">Details of B</HoverCardContent>
			</HoverCard>
		</div>
	);
}

async function openA() {
	const a = screen.getByRole("link", { name: "Thread A" });
	hover(a);
	await waitFor(() => expect(cards()[0]).toHaveTextContent("Details of A"));
	return cards()[0];
}

it("moves the open card to the next trigger at once, as the same element", async () => {
	const onA = vi.fn();
	render(() => <Pair onA={onA} />);
	const surface = await openA();
	hover(screen.getByRole("link", { name: "Thread B" }));
	await waitFor(() => expect(surface).toHaveTextContent("Details of B"), {
		timeout: 200,
	});
	expect(cards()).toEqual([surface]);
	expect(surface).not.toHaveTextContent("Details of A");
	expect(surface).toContainElement(document.getElementById("card-b"));
	expect(document.getElementById("card-a")).toBeNull();
	expect(onA).toHaveBeenLastCalledWith(false);
});

it("slides and resizes the card while it moves", async () => {
	render(() => <Pair />);
	const surface = await openA();
	const from = surface.offsetHeight;
	hover(screen.getByRole("link", { name: "Thread B" }));
	await waitFor(() => expect(surface).toHaveTextContent("Details of B"));
	expect(surface.parentElement!.style.transition).toContain("transform");
	const resize = surface.getAnimations().find(animation => {
		const [first] = (animation.effect as KeyframeEffect).getKeyframes();
		return first.height === `${from}px`;
	});
	expect(resize).toBeDefined();
	await waitFor(() => expect(surface.parentElement!.style.transition).toBe(""));
});

it("moves in place, without the slide or the fade, when focus moves from the keyboard", async () => {
	render(() => <Pair />);
	const a = screen.getByRole("link", { name: "Thread A" });
	const b = screen.getByRole("link", { name: "Thread B" });
	press("Tab");
	a.focus();
	await waitFor(() => expect(cards()[0]).toHaveTextContent("Details of A"));
	const surface = cards()[0];
	press("Tab");
	b.focus();
	await waitFor(() => expect(surface).toHaveTextContent("Details of B"), {
		timeout: 200,
	});
	expect(surface.parentElement!.style.transition).toBe("");
	expect(surface.getAnimations()).toHaveLength(0);
	await sleep(300);
	expect(cards()).toEqual([surface]);
	expect(surface).toHaveTextContent("Details of B");
});

it("waits before moving while the pointer is on its way to the open card", async () => {
	render(() => <Pair />);
	const surface = await openA();
	const a = screen.getByRole("link", { name: "Thread A" }).getBoundingClientRect();
	const card = surface.getBoundingClientRect();
	hover(screen.getByRole("link", { name: "Thread B" }), {
		x: card.left - 1,
		y: a.bottom + 4,
	});
	await sleep(60);
	expect(surface).toHaveTextContent("Details of A");
	await waitFor(() => expect(surface).toHaveTextContent("Details of B"), {
		timeout: 400,
	});
});

it("opens the next card at once, without the pop, shortly after one closes", async () => {
	render(() => <Pair />);
	await openA();
	press("Escape");
	await waitFor(() => expect(cards()).toHaveLength(0));
	hover(screen.getByRole("link", { name: "Thread B" }));
	await waitFor(() => expect(cards()[0]).toHaveTextContent("Details of B"), {
		timeout: 200,
	});
	expect(cards()[0]).toHaveAttribute("data-motion", "none");
});

it("waits for openDelay again once the skip window has passed", async () => {
	render(() => <Pair delayB={300} />);
	await openA();
	press("Escape");
	await waitFor(() => expect(cards()).toHaveLength(0));
	await sleep(450);
	hover(screen.getByRole("link", { name: "Thread B" }));
	await sleep(150);
	expect(cards()).toHaveLength(0);
	await waitFor(() => expect(cards()[0]).toHaveTextContent("Details of B"), {
		timeout: 600,
	});
});

it("keeps the cards of a group apart from the page card", async () => {
	render(() => (
		<>
			<Pair />
			<HoverCardGroup>
				<HoverCard openDelay={0}>
					<HoverCardTrigger href="#c">Thread C</HoverCardTrigger>
					<HoverCardContent>Details of C</HoverCardContent>
				</HoverCard>
			</HoverCardGroup>
		</>
	));
	await openA();
	hover(screen.getByRole("link", { name: "Thread C" }));
	await waitFor(() => expect(cards()).toHaveLength(2));
	expect(cards().map(card => card.textContent)).toEqual(["Details of A", "Details of C"]);
});

it("gives a card with shared={false} a surface of its own", async () => {
	render(() => (
		<>
			<Pair />
			<HoverCard openDelay={0} shared={false}>
				<HoverCardTrigger href="#d">Thread D</HoverCardTrigger>
				<HoverCardContent>Details of D</HoverCardContent>
			</HoverCard>
		</>
	));
	await openA();
	hover(screen.getByRole("link", { name: "Thread D" }));
	await waitFor(() => expect(cards()).toHaveLength(2));
});

it("closes the page card when the open HoverCard unmounts", async () => {
	const [shown, setShown] = createSignal(true);
	render(() => (
		<Show when={shown()}>
			<Pair />
		</Show>
	));
	await openA();
	setShown(false);
	await waitFor(() => expect(cards()).toHaveLength(0), { timeout: 200 });
});
