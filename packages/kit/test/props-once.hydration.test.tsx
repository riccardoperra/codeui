import { sharedConfig } from "solid-js";
import { hydrate } from "solid-js/web";
import { hydrationFixtures } from "./hydration/fixtures";
import serverHtmlJson from "../.hydration/server.json?raw";

// The server half runs first: `pnpm test:hydration` renders test/hydration.ssr.test.tsx.
const serverHtml: Record<string, string> = JSON.parse(serverHtmlJson);

declare global {
	// eslint-disable-next-line no-var
	var _$HY: {
		events: unknown[];
		completed: WeakSet<object>;
		r: Record<string, unknown>;
		done?: boolean;
	};
}

it("has server HTML for every fixture", () => {
	expect(Object.keys(serverHtml).sort()).toEqual(Object.keys(hydrationFixtures).sort());
});

it.each(Object.keys(hydrationFixtures))(
	"%s hydrates the server HTML without a mismatch",
	name => {
		// A mismatch leaves Solid's hydration state set; start each fixture clean.
		Object.assign(sharedConfig, {
			context: undefined,
			registry: undefined,
			effects: undefined,
			done: false,
		});
		globalThis._$HY = { events: [], completed: new WeakSet(), r: {} };
		const container = document.createElement("div");
		container.innerHTML = serverHtml[name];
		document.body.append(container);
		const before = [...container.querySelectorAll("[data-prop]")];
		const errors: unknown[] = [];
		const spy = vi
			.spyOn(console, "error")
			.mockImplementation((...args) => errors.push(args));
		try {
			const dispose = hydrate(hydrationFixtures[name], container);
			expect(errors).toEqual([]);
			// The server's nodes stay: the client adopted them instead of building new ones.
			const after = [...container.querySelectorAll("[data-prop]")];
			expect(after).toEqual(before);
			dispose();
		} finally {
			spy.mockRestore();
			container.remove();
		}
	},
);
