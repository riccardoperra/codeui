import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { checkHydration } from "../../examples/check-hydration.mjs";

if (!process.argv[2])
	throw new Error("Usage: node tools/styles/hydration.mjs <built-vite-fixture>");
const fixture = path.resolve(process.argv[2]);
const { preview } = await import(
	pathToFileURL(path.join(fixture, "node_modules/vite/dist/node/index.js"))
);
const engines = await import(
	pathToFileURL(path.join(fixture, "node_modules/playwright/index.mjs"))
);
const server = await preview({
	root: fixture,
	configFile: false,
	preview: { host: "127.0.0.1", port: 0 },
});
try {
	for (const name of ["chromium", "firefox", "webkit"]) {
		const browser = await engines[name].launch({ headless: true });
		try {
			const page = await browser.newPage();
			const result = await checkHydration(
				page,
				`http://127.0.0.1:${server.httpServer.address().port}/ssr.html`,
			);
			assert.deepEqual(
				result,
				{ adoption: true, errors: [] },
				`${name} adopts server portal nodes exactly once`,
			);
			console.log(`PASS ${name} SSR hydration: ${JSON.stringify(result)}`);
		} finally {
			await browser.close();
		}
	}
} finally {
	await new Promise(resolve => server.httpServer.close(resolve));
}
