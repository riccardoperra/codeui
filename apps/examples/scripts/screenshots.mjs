// Captures each example in both themes for the gallery cards: `public/screenshots/<slug>-<theme>.jpg`.
//
//   pnpm --filter @codeui/examples build && pnpm --filter @codeui/examples screenshots
//
// Playwright comes from `tools/baseline` (run `npm ci` there once), so the workspace does not carry it.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const require = createRequire(path.join(root, "../../tools/baseline/package.json"));
const { chromium } = require("playwright");
const examples = JSON.parse(readFileSync(path.join(root, "examples.json"), "utf8"));
const port = 6161;

const server = spawn("pnpm", ["exec", "vite", "preview", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore" });
try {
	// The preview server needs a moment before it accepts connections.
	for (let attempt = 0; ; attempt++) {
		try {
			await fetch(`http://localhost:${port}/`);
			break;
		} catch (error) {
			if (attempt > 50) throw error;
			await new Promise(resolve => setTimeout(resolve, 200));
		}
	}
	const browser = await chromium.launch();
	for (const theme of ["dark", "light"]) {
		const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
		// A fresh profile per theme, so one example's saved work never shows in another shot.
		await context.addInitScript(value => localStorage.setItem("theme", value), theme);
		for (const { slug } of examples) {
			const page = await context.newPage();
			await page.goto(`http://localhost:${port}/${slug}/`, { waitUntil: "networkidle" });
			await page.evaluate(() => document.fonts.ready);
			await page.waitForTimeout(400);
			await page.screenshot({ path: path.join(root, `public/screenshots/${slug}-${theme}.jpg`), type: "jpeg", quality: 82 });
			await page.close();
			console.log(`${slug}-${theme}.jpg`);
		}
		await context.close();
	}
	await browser.close();
} finally {
	server.kill();
}
