import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Button } from "../src";

afterEach(cleanup);

describe("Button loading", () => {
	it("is busy and disabled for assistive technology while loading", () => {
		render(() => <Button loading>Export</Button>);
		const button = screen.getByRole("button", { name: /Export/ });
		expect(button).toHaveAttribute("aria-busy", "true");
		expect(button).toHaveAttribute("aria-disabled", "true");
	});

	it("ignores clicks and does not submit its form while loading", () => {
		const onClick = vi.fn();
		const onSubmit = vi.fn((event: Event) => event.preventDefault());
		render(() => (
			<form onSubmit={onSubmit}>
				<Button type="submit" loading onClick={onClick}>
					Export
				</Button>
			</form>
		));
		fireEvent.click(screen.getByRole("button", { name: /Export/ }));
		expect(onClick).not.toHaveBeenCalled();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("keeps focus when loading starts, and activates again when it ends", () => {
		const onClick = vi.fn();
		const [loading, setLoading] = createSignal(false);
		render(() => (
			<Button loading={loading()} onClick={onClick}>
				Export
			</Button>
		));
		const button = screen.getByRole("button", { name: /Export/ });
		button.focus();
		setLoading(true);
		expect(button).toHaveFocus();
		expect(button).not.toBeDisabled();
		setLoading(false);
		expect(button).not.toHaveAttribute("aria-busy");
		fireEvent.click(button);
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
