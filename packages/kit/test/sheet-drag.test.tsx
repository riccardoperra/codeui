import { cleanup, fireEvent, render, screen } from "solid-testing-library";
import { createSignal } from "solid-js";
import { Sheet } from "../src/components/Sheet/Sheet";
import * as S from "../src/parts/sheet";
import { expectDismissed, press, tick } from "./helpers";

// Give the real browser sheet a fixed height; drive velocity samples with a test clock.
const SHEET_HEIGHT = 400;
let now = 0;

beforeAll(() => {
	window.scrollTo = () => {};
	vi.spyOn(performance, "now").mockImplementation(() => now);
});

afterAll(() => {
	vi.restoreAllMocks();
});

afterEach(cleanup);

function renderSheet() {
	render(() => {
		const [open, setOpen] = createSignal(false);
		return (
			<>
				<button onClick={() => setOpen(true)}>Open</button>
				<Sheet
					title="Layers"
					draggable
					closeLabel="Close layers"
					open={open()}
					onOpenChange={setOpen}
				>
					<p>Scrollable content</p>
				</Sheet>
			</>
		);
	});
	const opener = screen.getByRole("button", { name: "Open" });
	opener.focus();
	fireEvent.click(opener);
	screen.getByRole("dialog").style.height = `${SHEET_HEIGHT}px`;
	return opener;
}

/** Drags from y=100 through each offset, `stepMs` apart, then releases. */
function drag(
	target: HTMLElement,
	offsets: number[],
	stepMs: number,
	end: "pointerUp" | "pointerCancel" = "pointerUp",
) {
	const start = 100;
	fireEvent.pointerDown(target, { pointerId: 1, button: 0, clientY: start });
	for (const offset of offsets) {
		now += stepMs;
		fireEvent.pointerMove(target, { pointerId: 1, clientY: start + offset });
	}
	fireEvent[end](target, { pointerId: 1, clientY: start + offsets[offsets.length - 1] });
	fireEvent.click(target);
}

async function expectClosed(sheet: HTMLElement) {
	const overlay = document.querySelector<HTMLElement>(`[data-cui="${S.sheetParts.overlay}"]`);
	await expectDismissed(sheet);
	if (overlay) await expectDismissed(overlay);
	await tick();
}

const handle = () => screen.getAllByRole("button", { name: "Close layers" })[0];

describe("Sheet drag to dismiss", () => {
	it("closes after a drag past a third of its height and returns focus", async () => {
		const opener = renderSheet();
		await tick();
		const sheet = screen.getByRole("dialog");
		drag(handle(), [60, 120, 180], 100);
		await expectClosed(sheet);
		expect(document.activeElement).toBe(opener);
	});

	it("closes after a short, fast flick", async () => {
		renderSheet();
		await tick();
		const sheet = screen.getByRole("dialog");
		drag(handle(), [20, 60], 16);
		await expectClosed(sheet);
	});

	it("stays open after a short, slow drag", async () => {
		renderSheet();
		await tick();
		drag(handle(), [20, 40, 60], 200);
		await tick();
		const sheet = screen.getByRole("dialog");
		expect(sheet).toBeInTheDocument();
		expect(sheet.style.transform).toBe("");
	});

	it("stays open after an upward drag past the open position", async () => {
		renderSheet();
		await tick();
		drag(handle(), [-100, -200], 16);
		await tick();
		const sheet = screen.getByRole("dialog");
		expect(sheet).toContainElement(document.activeElement as HTMLElement);
	});

	it("stays open when the pointer is cancelled, however far it went", async () => {
		renderSheet();
		await tick();
		drag(handle(), [100, 300], 16, "pointerCancel");
		await tick();
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("scrolls instead of dragging when the gesture starts on the content", async () => {
		renderSheet();
		await tick();
		drag(screen.getByText("Scrollable content"), [100, 300], 16);
		await tick();
		const sheet = screen.getByRole("dialog");
		expect(sheet).toBeInTheDocument();
		expect(sheet.style.transform).toBe("");
	});

	it("closes on a tap of the handle", async () => {
		renderSheet();
		await tick();
		const sheet = screen.getByRole("dialog");
		drag(handle(), [1], 16);
		await expectClosed(sheet);
	});

	it("closes when the focused handle is pressed with Enter", async () => {
		const opener = renderSheet();
		await tick();
		const sheet = screen.getByRole("dialog");
		handle().focus();
		press("Enter");
		fireEvent.click(handle(), { detail: 0 });
		await expectClosed(sheet);
		expect(document.activeElement).toBe(opener);
	});

	it("shows the handle only on a draggable bottom sheet", () => {
		render(() => (
			<>
				<Sheet open modal={false} aria-label="Plain" showCloseButton={false} />
				<Sheet open modal={false} aria-label="Docked" draggable showCloseButton={false} />
			</>
		));
		expect(screen.getByRole("dialog", { name: "Plain" })).not.toContainElement(
			document.querySelector(`[data-cui="${S.sheetParts.handle}"]`),
		);
		expect(screen.getByRole("dialog", { name: "Docked" })).toContainElement(
			document.querySelector(`[data-cui="${S.sheetParts.handle}"]`),
		);
		// @ts-expect-error a side sheet cannot be dragged
		void (() => <Sheet side="right" draggable />);
	});
});
