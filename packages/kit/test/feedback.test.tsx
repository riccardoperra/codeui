import { toaster } from "@kobalte/core/toast";
import { cleanup, fireEvent, render, screen, waitFor } from "solid-testing-library";
import { Alert } from "../src/components/Alert/Alert";
import * as T from "../src/parts/toast";
import { alertParts, alertStyles } from "../src/parts/alert";
import { expectDismissed, tick } from "./helpers";

afterEach(() => {
	toaster.clear();
	cleanup();
});

describe("Alert", () => {
	it("announces children as its message", () => {
		render(() => <Alert>Saved offline</Alert>);
		expect(screen.getByRole("alert")).toHaveTextContent("Saved offline");
	});

	it("shows the description in place of children", () => {
		render(() => <Alert description={<em>From description</em>}>From children</Alert>);
		expect(screen.getByRole("alert")).toHaveTextContent("From description");
		expect(screen.queryByText("From children")).not.toBeInTheDocument();
	});

	it("renders title and action content as JSX", () => {
		render(() => (
			<Alert title={<strong>Update ready</strong>} action={<button>Reload</button>}>
				A new version is available.
			</Alert>
		));
		const alert = screen.getByRole("alert");
		expect(alert).toHaveTextContent("Update ready");
		expect(screen.getByRole("button", { name: "Reload" })).toBeInTheDocument();
	});

	it("shows a decorative icon only when showIcon is set on a status tone", () => {
		const icon = () => document.querySelector(`[data-cui="${alertParts.icon}"]`);
		const { unmount } = render(() => <Alert tone="danger">No icon</Alert>);
		expect(icon()).toBeNull();
		unmount();

		const neutral = render(() => <Alert showIcon>Neutral</Alert>);
		expect(icon()).toBeNull();
		neutral.unmount();

		render(() => (
			<Alert tone="danger" showIcon>
				Failed
			</Alert>
		));
		expect(icon()).toHaveAttribute("aria-hidden", "true");
		expect(icon()?.querySelector("svg")).not.toBeNull();
	});

	it("shows a custom icon with showIcon on any tone", () => {
		render(() => (
			<Alert showIcon icon={<span>★</span>}>
				Starred
			</Alert>
		));
		expect(document.querySelector(`[data-cui="${alertParts.icon}"]`)).toHaveTextContent(
			"★",
		);
	});

	it("puts each class from classes on its part", () => {
		render(() => (
			<Alert
				showIcon
				tone="info"
				title="T"
				action={<button>Go</button>}
				class="own"
				classes={{ root: "r", icon: "i", title: "t", description: "d", action: "a" }}
			>
				Body
			</Alert>
		));
		for (const [part, className] of [
			["root", "r"],
			["icon", "i"],
			["title", "t"],
			["description", "d"],
			["action", "a"],
		] as const) {
			expect(document.querySelector(`[data-cui="${alertParts[part]}"]`)).toHaveClass(
				className,
			);
		}
		expect(screen.getByRole("alert")).toHaveClass("own");
	});

	it("publishes one style function per part", () => {
		expect(Object.keys(alertStyles).sort()).toEqual(Object.keys(alertParts).sort());
	});
});

function renderRegion(position?: T.ToastPosition) {
	render(() => (
		<T.Region position={position}>
			<T.List />
		</T.Region>
	));
}

function showToast(tone?: T.ToastTone, onAction?: () => void) {
	return toaster.show(props => (
		<T.Root toastId={props.toastId} tone={tone}>
			<T.Icon>!</T.Icon>
			<T.Title>Export finished</T.Title>
			<T.Description>Saved to your downloads.</T.Description>
			<T.Action onClick={onAction}>Undo</T.Action>
			<T.CloseButton aria-label="Dismiss" />
			<T.ProgressTrack>
				<T.ProgressFill />
			</T.ProgressTrack>
		</T.Root>
	));
}

describe("Toast parts", () => {
	it("names the toast with its title and describes it with its description", async () => {
		renderRegion();
		showToast();
		const toast = await screen.findByRole("status", { name: "Export finished" });
		expect(toast).toHaveAccessibleDescription("Saved to your downloads.");
	});

	it("announces politely by default and assertively for the danger tone", async () => {
		renderRegion();
		showToast("success");
		showToast("danger");
		await waitFor(() => expect(screen.getAllByRole("status")).toHaveLength(2));
		const [success, danger] = screen.getAllByRole("status");
		expect(success).toHaveAttribute("aria-live", "polite");
		expect(danger).toHaveAttribute("aria-live", "assertive");
	});

	it("lets priority override the tone's announcement", async () => {
		renderRegion();
		toaster.show(props => (
			<T.Root toastId={props.toastId} priority="high">
				<T.Description>Urgent</T.Description>
			</T.Root>
		));
		expect(await screen.findByRole("status")).toHaveAttribute("aria-live", "assertive");
	});

	it("runs the inline action without closing the toast", async () => {
		const onAction = jest.fn();
		renderRegion();
		showToast("neutral", onAction);
		const action = await screen.findByRole("button", { name: "Undo" });
		expect(action).toHaveAttribute("type", "button");
		fireEvent.click(action);
		expect(onAction).toHaveBeenCalledTimes(1);
		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("closes from the labelled close button", async () => {
		renderRegion();
		showToast();
		const toast = await screen.findByRole("status");
		fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
		await tick();
		await expectDismissed(toast);
	});

	it("closes when Escape is pressed on the focused toast", async () => {
		renderRegion();
		showToast();
		const toast = await screen.findByRole("status");
		toast.focus();
		fireEvent.keyDown(toast, { key: "Escape" });
		await tick();
		await expectDismissed(toast);
	});

	it("places the region at bottom center unless a position is given", () => {
		renderRegion();
		renderRegion("top-right");
		const regions = document.querySelectorAll(`[data-cui="${T.toastParts.region}"]`);
		expect(regions[0]).toHaveAttribute("data-position", "bottom-center");
		expect(regions[1]).toHaveAttribute("data-position", "top-right");
	});

	it("publishes one style function per part", () => {
		expect(Object.keys(T.toastStyles).sort()).toEqual(Object.keys(T.toastParts).sort());
	});
});
