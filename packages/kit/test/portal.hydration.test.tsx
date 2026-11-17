import serverHtmlJson from "../.hydration/portals.json?raw";
const serverHtml: Record<string, string> = JSON.parse(serverHtmlJson);
import { sharedConfig } from "solid-js";
import { hydrate } from "solid-js/web";
import { fireEvent, waitFor } from "solid-testing-library";
import { expectDismissed } from "./helpers";
import { portalFixtures } from "./hydration/portal-fixtures";


beforeAll(() => {
	vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterAll(() => vi.restoreAllMocks());


it.each(Object.keys(portalFixtures))(
	"%s hydrates, relocates and cleans up the server nodes",
	async name => {
		Object.assign(sharedConfig, {
			context: undefined,
			registry: undefined,
			effects: undefined,
			done: false,
		});
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
		const input = container.querySelector<HTMLInputElement>("input");
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
			if (name.includes("autofocus")) expect(document.activeElement).toBe(input);
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
				await expectDismissed(reopened);
				await waitFor(() => expect(document.activeElement).toBe(trigger));
			}
			if (name === "Nested") {
				const inner = before.find(node => node.dataset.portalNode === "inner")!;
				const outer = before.find(node => node.dataset.portalNode === "outer")!;
				fireEvent.keyDown(inner, { key: "Escape" });
				await expectDismissed(inner);
				expect(outer).toBeInTheDocument();
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
