#!/usr/bin/env node
// Open one story per theme, run an optional journey, and save evidence.
// Usage: node drive.mjs <story-id> [--theme dark|light|both] [--journey <file.mjs>] [--label <name>] [--run <runId>]
// A journey file default-exports async ({ page, step, check, focus, axe, theme, backgrounds }) => {}.
// Evidence: .verify-codeui/evidence/<stamp>-<story-id>[-label]/<theme>/{NN-step.png, axe-*.json} + transcript.json
import AxeBuilder from "../../../../tools/baseline/node_modules/@axe-core/playwright/dist/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { baseline, evidenceDir, flag, loadRun, root } from "./lib.mjs";

const storyId = process.argv[2];
if (!storyId || storyId.startsWith("--")) throw Error("Usage: node drive.mjs <story-id> [--theme dark|light|both] [--journey file.mjs]");
const themeArg = flag("theme", "both");
const themes = themeArg === "both" ? ["dark", "light"] : [themeArg];
const journeyPath = flag("journey");
const journey = journeyPath ? (await import(pathToFileURL(path.resolve(journeyPath)).href)).default : null;
const label = flag("label");
const run = await loadRun();
const { launch, open, backgrounds } = await baseline(run.url);

const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..*/, "");
const dir = path.join(evidenceDir, `${stamp}-${storyId}${label ? `-${label}` : ""}`);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const transcript = { storyId, runId: run.runId, mode: run.mode, url: `${run.url}/iframe.html?id=${storyId}&viewMode=story`, journey: journeyPath ? path.relative(root, path.resolve(journeyPath)) : null, startedAt: new Date().toISOString(), themes: {}, ok: true };

const browser = await launch();
try {
	for (const theme of themes) {
		const themeDir = path.join(dir, theme);
		await mkdir(themeDir, { recursive: true });
		const t = (transcript.themes[theme] = { ok: true, entries: [] });
		const fail = () => { t.ok = false; transcript.ok = false; };
		const { context, page, errors, rendered } = await open(browser, { id: storyId, type: "story" }, theme);
		let n = 0;
		const shot = async name => {
			const file = `${String(++n).padStart(2, "0")}-${slug(name)}.png`;
			await page.screenshot({ path: path.join(themeDir, file), animations: "disabled" });
			return path.join(theme, file);
		};
		const focus = () => page.evaluate(() => {
			const el = document.activeElement;
			return {
				tag: el?.tagName.toLowerCase(), role: el?.getAttribute("role"), dataCui: el?.getAttribute("data-cui"),
				name: el?.getAttribute("aria-label") || (el === document.body ? "" : el?.textContent?.trim().slice(0, 60)) || "",
				inDialog: !!el?.closest("[role=dialog]"),
			};
		});
		const step = async (name, fn) => {
			const entry = { type: "action", name };
			try { await fn?.(); } catch (e) { entry.error = e.message; fail(); }
			entry.focus = await focus();
			entry.screenshot = await shot(name);
			t.entries.push(entry);
			if (entry.error) throw Error(`step "${name}": ${entry.error}`);
		};
		const check = async (name, fn) => {
			let pass = false, actual;
			try { actual = await fn(); pass = actual === true || actual?.pass === true; } catch (e) { actual = { error: e.message }; }
			if (!pass) fail();
			t.entries.push({ type: "assert", name, pass, actual });
			return pass;
		};
		const axe = async name => {
			const result = await new AxeBuilder({ page }).analyze();
			await writeFile(path.join(themeDir, `axe-${slug(name)}.json`), JSON.stringify(result, null, 2));
			const violations = result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
			t.entries.push({ type: "axe", name, file: path.join(theme, `axe-${slug(name)}.json`), violations });
			return violations;
		};
		try {
			await check("story rendered without page errors", () => ({ pass: rendered && !errors.length, rendered, errors }));
			await step("rendered");
			await axe("rendered");
			if (journey) await journey({ page, step, check, focus, axe, theme, backgrounds });
		} catch (e) {
			t.error = e.message;
			fail();
		} finally {
			t.pageErrors = errors;
			await context.close();
		}
	}
} finally {
	await browser.close();
	transcript.finishedAt = new Date().toISOString();
	await mkdir(dir, { recursive: true });
	await writeFile(path.join(dir, "transcript.json"), JSON.stringify(transcript, null, 2));
}
const summary = Object.fromEntries(Object.entries(transcript.themes).map(([k, v]) => [k, { ok: v.ok, asserts: v.entries.filter(e => e.type === "assert").map(e => `${e.pass ? "PASS" : "FAIL"} ${e.name}`), axe: v.entries.filter(e => e.type === "axe").map(e => `${e.name}: ${e.violations.map(x => x.id).join(",") || "none"}`), error: v.error }]));
console.log(JSON.stringify({ ok: transcript.ok, evidence: path.relative(root, dir), themes: summary }, null, 2));
process.exitCode = transcript.ok ? 0 : 1;
