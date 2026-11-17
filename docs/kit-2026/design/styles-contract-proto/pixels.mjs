import { chromium } from "../../../../tools/baseline/node_modules/playwright/index.mjs";
import { readFile, writeFile } from "node:fs/promises";
const rows = [];
const b = await chromium.launch();
const p = await b.newPage();
for (const theme of ["dark", "light"]) {
	const prefix = "docs/kit-2026/design/styles-contract-proto/screenshots/";
	const images = await Promise.all(
		["storybook", "contract"].map(
			async kind =>
				"data:image/png;base64," +
				(await readFile(prefix + kind + "-panel-" + theme + ".png")).toString("base64"),
		),
	);
	rows.push({
		theme,
		...(await p.evaluate(async images => {
			const data = await Promise.all(
				images.map(async src => {
					const i = new Image();
					i.src = src;
					await i.decode();
					const c = document.createElement("canvas");
					c.width = i.width;
					c.height = i.height;
					const ctx = c.getContext("2d");
					ctx.drawImage(i, 0, 0);
					return {
						width: i.width,
						height: i.height,
						data: ctx.getImageData(0, 0, i.width, i.height).data,
					};
				}),
			);
			let count = 0,
				minX = 9999,
				minY = 9999,
				maxX = 0,
				maxY = 0;
			for (let i = 0; i < data[0].data.length; i += 4) {
				if ([0, 1, 2, 3].some(k => data[0].data[i + k] !== data[1].data[i + k])) {
					count++;
					const x = (i / 4) % data[0].width,
						y = Math.floor(i / 4 / data[0].width);
					minX = Math.min(x, minX);
					maxX = Math.max(x, maxX);
					minY = Math.min(y, minY);
					maxY = Math.max(y, maxY);
				}
			}
			return {
				width: data[0].width,
				height: data[0].height,
				count,
				bounds: [minX, minY, maxX, maxY],
			};
		}, images)),
	});
}
await b.close();
await writeFile(
	new URL("pixel-comparison.json", import.meta.url),
	JSON.stringify(rows, null, 2),
);
console.log(rows);
