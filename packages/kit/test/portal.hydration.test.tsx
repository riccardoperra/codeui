import { hydrate } from "@solidjs/web";
import { fireEvent, screen, waitFor } from "@solidjs/testing-library";
import { expectDismissed, tick } from "./helpers";
import { portalFixtures } from "./hydration/portal-fixtures";
import portalHtmlJson from "../.hydration/portals.json?raw";

const serverHtml: Record<string, string> = JSON.parse(portalHtmlJson);

it.each(Object.keys(portalFixtures))(
	"%s hydrates, relocates and cleans up the server nodes",
	async name => {
		Object.assign(globalThis, { _$HY: { events: [], completed: new WeakSet(), r: {} } });
		const host = document.createElement("div");
		host.id = "portal-test-host";
		const secondHost = document.createElement("div");
		secondHost.id = "portal-second-host";
		const container = document.createElement("div");
		container.innerHTML = serverHtml[name];
		document.body.append(host, secondHost, container);
		const before = [...container.querySelectorAll<HTMLElement>("[data-portal-node]")];
		expect(before.length).toBeGreaterThan(0);
		const input = container.querySelector<HTMLInputElement>('[data-portal-node="input"]');
		if (input) input.value = "Typed before hydration";
		let dispose: (() => void) | undefined;
		try {
			dispose = hydrate(portalFixtures[name], container);
			const after = [...document.querySelectorAll<HTMLElement>("[data-portal-node]")];
			expect(after).toHaveLength(before.length);
			for (const node of before) expect(after).toContain(node);
			expect(container.querySelector("[data-portal-node]")).toBeNull();
			if (name.includes("custom mount")) expect(host.contains(before[0])).toBe(true);
			if (input) expect(input.value).toBe("Typed before hydration");
			if (name.includes("autofocus")) await waitFor(() => expect(document.activeElement).toBe(input));
			const action = document.querySelector<HTMLElement>('[data-portal-node="action"]');
			if (action) {
				fireEvent.click(action);
				expect(action.textContent).toBe("Count 1");
				expect(container.querySelector("[data-portal-bubbled]")?.textContent).toBe("1");
				if (name.includes("custom mount")) {
					fireEvent.click(container.querySelector<HTMLElement>("[data-portal-move]")!);
					expect(secondHost.contains(action)).toBe(true);
					expect(host.querySelector("[data-portal-node]")).toBeNull();
				}
				fireEvent.click(document.querySelector<HTMLElement>("[data-portal-close]")!);
				await expectDismissed(action);
				await waitFor(() =>
					expect(document.querySelector("[data-portal-node]")).toBeNull(),
				);
				const trigger = container.querySelector<HTMLElement>("[data-portal-trigger]")!;
				await waitFor(() => expect(document.activeElement).toBe(trigger));
				fireEvent.click(trigger);
				await waitFor(() =>
					expect(document.querySelector("[data-portal-node]")).not.toBeNull(),
				);
				const reopened = document.querySelector<HTMLElement>("[data-portal-node]")!;
				fireEvent.keyDown(reopened, { key: "Escape" });
				fireEvent.keyUp(reopened, { key: "Escape" });
				await expectDismissed(reopened);
				await waitFor(() => expect(document.activeElement).toBe(trigger));
			}
			if (name.startsWith("Nested")) {
				const outer = before.find(node => node.dataset.portalNode === "outer")!;
				const trigger = screen.getByRole("button", { name: "Open inner" });
				if (name === "Nested opens after hydration") {
					await tick();
					fireEvent.click(trigger);
				}
				const inner = await screen.findByRole("button", { name: "Inner content" });
				fireEvent.keyDown(inner, { key: "Escape" });
				fireEvent.keyUp(inner, { key: "Escape" });
				await expectDismissed(inner);
				expect(outer).toBeInTheDocument();
				await waitFor(() => expect(trigger).toHaveFocus());
			}
			if (name === "Sheet") {
				await tick();
				expect(getComputedStyle(document.body).pointerEvents).toBe("none");
				expect(getComputedStyle(before[0]).pointerEvents).toBe("auto");
				fireEvent.pointerDown(container, { pointerType: "mouse" });
				await expectDismissed(before[0]);
				expect(getComputedStyle(document.body).pointerEvents).toBe("auto");
			}
			dispose();
			dispose = undefined;
			expect(document.querySelector("[data-portal-node]")).toBeNull();
		} finally {
			dispose?.();
			container.remove();
			host.remove();
			secondHost.remove();
		}
	},
);
