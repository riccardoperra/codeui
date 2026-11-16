import { toaster as engine } from "@kobalte/core/toast";
import { createContext, createRoot, useContext } from "solid-js";
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "solid-testing-library";
import {
	createToaster,
	Toaster,
	type ToastController,
} from "../src/components/Toast/Toaster";
import { toastParts } from "../src/parts/toast";
import { expectDismissed, tick } from "./helpers";

afterEach(() => {
	engine.clear();
	cleanup();
	jest.useRealTimers();
});

function mount(controller: ToastController, label = "Notifications") {
	render(() => <Toaster toaster={controller} closeLabel="Close" aria-label={label} />);
	return screen.getByRole("region", { name: label });
}

describe("createToaster", () => {
	it("shows title and description content in its Toaster", async () => {
		const notifications = createToaster();
		const region = mount(notifications);
		notifications.show({ title: <b>Exported</b>, description: "Saved to downloads." });
		const toast = await within(region).findByRole("status", { name: "Exported" });
		expect(toast).toHaveAccessibleDescription("Saved to downloads.");
	});

	it("keeps each controller's toasts in its own Toaster", async () => {
		const editor = createToaster();
		const dashboard = createToaster();
		const editorRegion = mount(editor, "Editor");
		const dashboardRegion = mount(dashboard, "Dashboard");
		editor.show({ description: "From editor" });
		dashboard.show({ description: "From dashboard" });
		await within(editorRegion).findByText("From editor");
		await within(dashboardRegion).findByText("From dashboard");
		expect(within(editorRegion).queryByText("From dashboard")).toBeNull();
		expect(within(dashboardRegion).queryByText("From editor")).toBeNull();
	});

	it("queues toasts shown before its Toaster mounts", async () => {
		const notifications = createToaster();
		notifications.show({ description: "Early" });
		const region = mount(notifications);
		expect(await within(region).findByText("Early")).toBeInTheDocument();
	});

	it("passes the toast id and a dismiss callback to content callbacks", async () => {
		const notifications = createToaster();
		mount(notifications);
		const id = notifications.show({
			description: toast => (
				<button onClick={toast.dismiss}>Dismiss toast {toast.id}</button>
			),
		});
		const button = await screen.findByRole("button", { name: `Dismiss toast ${id}` });
		const toast = screen.getByRole("status");
		fireEvent.click(button);
		await tick();
		await expectDismissed(toast);
	});

	it("updates the open toast in place", async () => {
		const notifications = createToaster();
		mount(notifications);
		const id = notifications.show({ description: "Uploading" });
		const toast = await screen.findByRole("status");
		notifications.update(id, { description: "Uploaded", tone: "success" });
		await waitFor(() => expect(toast).toHaveTextContent("Uploaded"));
		expect(toast).toHaveAttribute("data-tone", "success");
		expect(screen.getByRole("status")).toBe(toast);
	});

	it("dismisses one toast with its exit, and ignores updates after", async () => {
		const notifications = createToaster();
		mount(notifications);
		const first = notifications.show({ description: "First" });
		notifications.show({ description: "Second" });
		await waitFor(() => expect(screen.getAllByRole("status")).toHaveLength(2));
		const toast = screen.getByText("First").closest<HTMLElement>("[role=status]")!;
		notifications.dismiss(first);
		await tick();
		expect(toast).toHaveAttribute("data-closed");
		await expectDismissed(toast);
		notifications.update(first, { description: "Back" });
		await tick();
		expect(screen.queryByText("Back")).toBeNull();
		expect(screen.getByText("Second")).toBeInTheDocument();
	});

	it("dismisses a queued toast before it is shown", async () => {
		const notifications = createToaster();
		const queued = notifications.show({ description: "Never shown" });
		notifications.dismiss(queued);
		mount(notifications);
		await tick();
		expect(screen.queryByText("Never shown")).toBeNull();
	});

	it("clears only its own toasts", async () => {
		const mine = createToaster();
		const other = createToaster();
		mount(mine, "Mine");
		mount(other, "Other");
		mine.show({ description: "Mine A" });
		mine.show({ description: "Mine B" });
		other.show({ description: "Theirs" });
		await screen.findByText("Theirs");
		const toasts = ["Mine A", "Mine B"].map(
			text => screen.getByText(text).closest<HTMLElement>("[role=status]")!,
		);
		mine.clear();
		await tick();
		for (const toast of toasts) await expectDismissed(toast);
		expect(screen.getByText("Theirs")).toBeInTheDocument();
	});

	it("clears its toasts when the owner that created it is disposed", async () => {
		let notifications!: ToastController;
		const dispose = createRoot(dispose => {
			notifications = createToaster();
			return dispose;
		});
		mount(notifications);
		notifications.show({ description: "Scoped" });
		const toast = (await screen.findByText("Scoped")).closest<HTMLElement>(
			"[role=status]",
		)!;
		dispose();
		await tick();
		await expectDismissed(toast);
	});

	it("runs the action with the toast context and stays open", async () => {
		const notifications = createToaster();
		mount(notifications);
		const onClick = jest.fn();
		const id = notifications.show({
			description: "Deleted",
			action: { label: "Undo", onClick },
		});
		fireEvent.click(await screen.findByRole("button", { name: "Undo" }));
		expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ id }));
		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("labels the close button and hides it when not closeable", async () => {
		const notifications = createToaster();
		mount(notifications);
		notifications.show({ description: "Closeable" });
		notifications.show({ description: "Stuck", closeable: false });
		await waitFor(() => expect(screen.getAllByRole("status")).toHaveLength(2));
		const [closeable, stuck] = screen.getAllByRole("status");
		expect(within(closeable).getByRole("button", { name: "Close" })).toBeInTheDocument();
		expect(within(stuck).queryByRole("button")).toBeNull();
		fireEvent.click(within(closeable).getByRole("button", { name: "Close" }));
		await tick();
		await expectDismissed(closeable);
	});

	it("closes on Escape from the focused toast", async () => {
		const notifications = createToaster();
		mount(notifications);
		notifications.show({ description: "Escape me" });
		const toast = await screen.findByRole("status");
		toast.focus();
		fireEvent.keyDown(toast, { key: "Escape" });
		await tick();
		await expectDismissed(toast);
	});

	it("shows the tone icon for status tones, a custom icon, or none", async () => {
		const notifications = createToaster();
		render(() => <Toaster toaster={notifications} closeLabel="Close" limit={4} />);
		notifications.show({ description: "Plain" });
		notifications.show({ description: "Done", tone: "success" });
		notifications.show({ description: "Starred", icon: "★" });
		notifications.show({ description: "Quiet", tone: "danger", icon: null });
		await waitFor(() => expect(screen.getAllByRole("status")).toHaveLength(4));
		const icon = (text: string) =>
			screen
				.getByText(text)
				.closest("[role=status]")!
				.querySelector(`[data-cui="${toastParts.icon}"]`);
		expect(icon("Plain")).toBeNull();
		expect(icon("Done")?.querySelector("svg")).not.toBeNull();
		expect(icon("Starred")).toHaveTextContent("★");
		expect(icon("Quiet")).toBeNull();
	});

	it("renders the toast in the requested theme", async () => {
		const notifications = createToaster();
		mount(notifications);
		notifications.show({ description: "Inverted", theme: "light" });
		expect(await screen.findByRole("status")).toHaveAttribute("data-cui-theme", "light");
	});

	it("renders content inside the providers around its Toaster", async () => {
		const Locale = createContext("en");
		const notifications = createToaster();
		render(() => (
			<Locale.Provider value="it">
				<Toaster toaster={notifications} closeLabel="Chiudi" />
			</Locale.Provider>
		));
		notifications.show({ description: () => `Lingua: ${useContext(Locale)}` });
		expect(await screen.findByText("Lingua: it")).toBeInTheDocument();
	});
});

describe("toast timing", () => {
	beforeEach(() => jest.useFakeTimers());

	async function advance(ms: number) {
		jest.advanceTimersByTime(ms);
		await Promise.resolve();
	}

	it("closes after its duration", async () => {
		const notifications = createToaster({ duration: 1000 });
		mount(notifications);
		notifications.show({ description: "Brief" });
		await advance(0);
		const toast = screen.getByRole("status");
		await advance(999);
		expect(toast).not.toHaveAttribute("data-closed");
		await advance(1);
		expect(toast).toHaveAttribute("data-closed");
	});

	it("pauses while the pointer is over the toasts", async () => {
		const notifications = createToaster({ duration: 1000 });
		mount(notifications);
		notifications.show({ description: "Hover me" });
		await advance(0);
		const toast = screen.getByRole("status");
		fireEvent.pointerMove(toast);
		await advance(5000);
		expect(toast).not.toHaveAttribute("data-closed");
		fireEvent.pointerLeave(toast.parentElement!);
		await advance(1000);
		expect(toast).toHaveAttribute("data-closed");
	});

	it("stays open with an infinite duration", async () => {
		const notifications = createToaster();
		mount(notifications);
		notifications.show({ description: "Sticky", duration: Infinity });
		await advance(0);
		await advance(60_000);
		expect(screen.getByRole("status")).not.toHaveAttribute("data-closed");
	});

	it("restarts the timer when an update changes the duration", async () => {
		const notifications = createToaster({ duration: 1000 });
		mount(notifications);
		const id = notifications.show({ description: "Saving", duration: Infinity });
		await advance(5000);
		notifications.update(id, { description: "Saved", duration: 2000 });
		await advance(0);
		const toast = screen.getByRole("status");
		expect(toast).toHaveTextContent("Saved");
		await advance(1999);
		expect(toast).not.toHaveAttribute("data-closed");
		await advance(1);
		expect(toast).toHaveAttribute("data-closed");
	});
});

describe("promise", () => {
	function deferred<D>() {
		let resolve!: (value: D) => void;
		let reject!: (reason: unknown) => void;
		const promise = new Promise<D>((res, rej) => {
			resolve = res;
			reject = rej;
		});
		return { promise, resolve, reject };
	}

	it("shows loading with a spinner, then success in the same toast", async () => {
		const notifications = createToaster();
		mount(notifications);
		const work = deferred<string>();
		notifications.promise(work.promise, {
			loading: { description: "Exporting" },
			success: name => ({ description: `Exported ${name}` }),
			error: { description: "Failed" },
		});
		const toast = await screen.findByRole("status");
		expect(toast).toHaveTextContent("Exporting");
		expect(toast.querySelector(`[data-cui="${toastParts.icon}"] svg`)).not.toBeNull();
		work.resolve("snippet.png");
		await waitFor(() =>
			expect(screen.getByRole("status")).toHaveTextContent("Exported snippet.png"),
		);
		expect(screen.getByRole("status")).toHaveAttribute("data-tone", "success");
	});

	it("shows the error options with the danger tone when the promise rejects", async () => {
		const notifications = createToaster();
		mount(notifications);
		notifications.promise(() => Promise.reject(new Error("disk full")), {
			loading: { description: "Saving" },
			success: { description: "Saved" },
			error: reason => ({ description: `Failed: ${(reason as Error).message}` }),
		});
		await waitFor(() =>
			expect(screen.getByRole("status")).toHaveTextContent("Failed: disk full"),
		);
		const toast = screen.getByRole("status");
		expect(toast).toHaveAttribute("data-tone", "danger");
		expect(toast).toHaveAttribute("aria-live", "assertive");
	});

	it("leaves a toast dismissed while loading closed", async () => {
		const notifications = createToaster();
		mount(notifications);
		const work = deferred<void>();
		const id = notifications.promise(work.promise, {
			loading: { description: "Loading" },
			success: { description: "Loaded" },
			error: { description: "Failed" },
		});
		const toast = await screen.findByRole("status");
		notifications.dismiss(id);
		await tick();
		await expectDismissed(toast);
		work.resolve();
		await tick();
		expect(screen.queryByText("Loaded")).toBeNull();
	});
});
