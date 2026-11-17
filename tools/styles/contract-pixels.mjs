import { chromium } from "playwright";
import { readFile, writeFile } from "node:fs/promises";
const directory = new URL("../../.artifacts/styles-pilot-parity/", import.meta.url);
const b = await chromium.launch();
const p = await b.newPage();
const results = [];
try {
	for (const component of ["button", "iconbutton", "track", "panel"])
		for (const theme of ["dark", "light"]) {
			const images = await Promise.all(
				["storybook", "contract"].map(
					async kind =>
						"data:image/png;base64," +
						(
							await readFile(
								new URL(
									"screenshots/" + kind + "-" + component + "-" + theme + ".png",
									directory,
								),
							)
						).toString("base64"),
				),
			);
			const result = await p.evaluate(async images => {
				const data = await Promise.all(
					images.map(async src => {
						const i = new Image();
						i.src = src;
						await i.decode();
						const c = document.createElement("canvas");
						c.width = i.width;
						c.height = i.height;
						const x = c.getContext("2d");
						x.drawImage(i, 0, 0);
						return {
							width: c.width,
							height: c.height,
							bytes: x.getImageData(0, 0, c.width, c.height).data,
						};
					}),
				);
				if (data[0].width !== data[1].width || data[0].height !== data[1].height)
					return {
						dimensions: false,
						before: [data[0].width, data[0].height],
						after: [data[1].width, data[1].height],
					};
				let changed = 0;
				for (let i = 0; i < data[0].bytes.length; i += 4)
					if ([0, 1, 2, 3].some(k => data[0].bytes[i + k] !== data[1].bytes[i + k]))
						changed++;
				return {
					dimensions: true,
					width: data[0].width,
					height: data[0].height,
					changed,
				};
			}, images);
			if (!result.dimensions || result.changed > (component === "button" ? 1 : 0))
				throw new Error(
					"Pixel parity failed: " +
						component +
						" " +
						theme +
						" " +
						JSON.stringify(result),
				);
			results.push({ component, theme, ...result });
		}
	await writeFile(
		new URL("pixel-comparison.json", directory),
		JSON.stringify(results, null, 2),
	);
	console.log(results);
} finally {
	await b.close();
}
