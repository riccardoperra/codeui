import { readFile, writeFile, mkdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { chromium } from "playwright";
const reference = process.argv[2];
if (!reference)
	throw new Error("Usage: node tools/styles/spike-s1-compare.mjs <reference-dist>");
const output = new URL("../../.artifacts/styles-spike-s1/", import.meta.url);
await mkdir(output, { recursive: true });
const current = new URL("../../packages/styles/dist/", import.meta.url);
const css = async (root, name) =>
	readFile(
		typeof root === "string" ? `${root}/${name}.css` : new URL(name + ".css", root),
		"utf8",
	);
const metrics = [];
for (const name of ["button", "icon-button", "switch", "dialog"]) {
	const row = { component: name };
	for (const [kind, root] of [
		["pilot", reference],
		["plain", current],
	]) {
		const text = await css(root, name);
		row[kind] = {
			raw: Buffer.byteLength(text),
			gzip: gzipSync(text).length,
			selectors: [...text.matchAll(/:where\(/g)].length,
		};
	}
	metrics.push(row);
}
const browser = await chromium.launch();
const pixels = [];
try {
	const page = await browser.newPage();
	for (const component of ["button", "iconbutton", "switch", "dialog"])
		for (const theme of ["dark", "light"])
			for (const [width, height] of [
				[1440, 900],
				[1024, 768],
				[390, 844],
			]) {
				await page.setViewportSize({ width, height });
				const html = await readFile(
					new URL(
						`../../.artifacts/styles-pilot-parity/${component}-${theme}.html`,
						import.meta.url,
					),
					"utf8",
				);
				const images = [];
				for (const [kind, root] of [
					["pilot", reference],
					["plain", current],
				]) {
					const reset = await readFile(
						new URL("../../packages/storybook/.storybook/reset.css", import.meta.url),
						"utf8",
					);
					const content =
						html.replace(/<link[^>]+>/g, "") +
						`<style>${reset}\n${await css(root, "all")}</style>`;
					await page.setContent(content);
					await page.evaluate(() => document.fonts.ready);
					const png = await page.screenshot();
					images.push("data:image/png;base64," + png.toString("base64"));
					await writeFile(
						new URL(`${component}-${theme}-${width}-${kind}.png`, output),
						png,
					);
				}
				const diff = await page.evaluate(async images => {
					const buffers = await Promise.all(
						images.map(async src => {
							const image = new Image();
							image.src = src;
							await image.decode();
							const canvas = document.createElement("canvas");
							canvas.width = image.width;
							canvas.height = image.height;
							const ctx = canvas.getContext("2d");
							ctx.drawImage(image, 0, 0);
							return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
						}),
					);
					let count = 0;
					for (let i = 0; i < buffers[0].length; i += 4)
						if (buffers[0].slice(i, i + 4).some((v, k) => v !== buffers[1][i + k]))
							count++;
					return count;
				}, images);
				pixels.push({ component, theme, width, height, differentPixels: diff });
			}
} finally {
	await browser.close();
}
await writeFile(
	new URL("comparison.json", output),
	JSON.stringify({ metrics, pixels }, null, 2) + "\n",
);
console.log(
	JSON.stringify({ metrics, pixelDiffs: pixels.map(p => p.differentPixels) }, null, 2),
);
if (pixels.some(p => p.differentPixels)) process.exitCode = 1;
