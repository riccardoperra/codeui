import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { renderToString } from "solid-js/web";
import { hydrationFixtures } from "./hydration/fixtures";
import { serverHtmlFile } from "./hydration/paths";

// Renders the server half of the hydration check. `pnpm test:hydration` hydrates
// these strings on the client (test/props-once.hydration.test.tsx).
it("server renders every hydration fixture", () => {
	const html: Record<string, string> = {};
	for (const [name, fixture] of Object.entries(hydrationFixtures)) {
		html[name] = renderToString(fixture);
		expect(html[name]).toContain("data-prop");
	}
	mkdirSync(dirname(serverHtmlFile), { recursive: true });
	writeFileSync(serverHtmlFile, JSON.stringify(html, null, 1));
});

import { portalFixtures } from "./hydration/portal-fixtures";
import { portalHtmlFile } from "./hydration/paths";
it("server renders portal hydration fixtures", () => {
	const html: Record<string, string> = {};
	for (const [name, fixture] of Object.entries(portalFixtures)) {
		html[name] = renderToString(fixture);
		expect(html[name]).toContain("data-portal-node");
	}
	mkdirSync(dirname(portalHtmlFile), { recursive: true });
	writeFileSync(portalHtmlFile, JSON.stringify(html, null, 1));
});
