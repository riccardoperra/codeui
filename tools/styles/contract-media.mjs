import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
const css = await readFile(
	new URL("../../packages/styles/dist/all.css", import.meta.url),
	"utf8",
);
const b = await chromium.launch();
const p = await b.newPage({
	viewport: { width: 390, height: 844 },
	isMobile: true,
	hasTouch: true,
});
try {
	await p.emulateMedia({ reducedMotion: "reduce" });
	await p.setContent(`<!doctype html><html data-cui-theme="light"><meta name="viewport" content="width=device-width"><style>${css}*,*::before,*::after{box-sizing:border-box}body{margin:0}.motion-sample{animation-duration:3600s}</style><body>
<div id="panel" class="cui-dialog-panel" data-size="settings" data-chrome="inset"><aside id="sidebar" class="cui-dialog-sidebar" data-cui="dialog-sidebar">Side</aside><main id="main" class="cui-dialog-main"><div class="cui-dialog-panel-content">Body</div></main></div>
<nav class="cui-dialog-nav"><ul id="nav-list"><li><button id="nav-item" class="cui-dialog-nav-item"><span id="nav-icon" class="cui-dialog-nav-icon">G</span>Name</button></li></ul></nav>
<div id="root" class="cui-switch-root"><div id="control" class="cui-switch-control"><span id="thumb" class="cui-switch-thumb"></span></div></div>
<div class="cui-dialog-positioner"><div id="motion" class="cui-dialog-panel motion-sample" data-size="md" data-motion="auto" data-expanded></div></div></body></html>`);
	const r = await p.evaluate(() => {
		const c = id => getComputedStyle(document.getElementById(id));
		const frames = document
			.getElementById("motion")
			.getAnimations()
			.flatMap(a => a.effect.getKeyframes());
		return {
			coarse: matchMedia("(pointer: coarse)").matches,
			phone: innerWidth,
			rootMin: c("root").minHeight,
			controlWidth: c("control").width,
			controlHeight: c("control").height,
			thumbWidth: c("thumb").width,
			thumbTransition: c("thumb").transitionDuration,
			panelDirection: c("panel").flexDirection,
			mainDisplay: c("main").display,
			navDisplay: c("nav-list").display,
			navIconDisplay: c("nav-icon").display,
			navItemHeight: c("nav-item").height,
			navTransition: c("nav-item").transitionDuration,
			animationFrames: frames.length,
			animationMoves: frames.some(f => "transform" in f),
		};
	});
	console.log(r);
	await writeFile(
		new URL("../../.artifacts/styles-pilot-media.json", import.meta.url),
		JSON.stringify(r, null, 2),
	);
	assert.equal(r.coarse, true);
	assert.equal(r.phone, 390);
	assert.equal(r.rootMin, "40px");
	assert.equal(r.controlWidth, "44px");
	assert.equal(r.controlHeight, "26px");
	assert.equal(r.thumbWidth, "20px");
	assert.equal(r.thumbTransition, "0s");
	assert.equal(r.panelDirection, "column");
	assert.equal(r.mainDisplay, "contents");
	assert.equal(r.navDisplay, "grid");
	assert.equal(r.navIconDisplay, "none");
	assert.equal(r.navItemHeight, "40px");
	assert.equal(r.navTransition, "0s");
	assert(r.animationFrames > 0);
	assert.equal(r.animationMoves, false);
} finally {
	await b.close();
}
