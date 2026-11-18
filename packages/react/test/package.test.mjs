import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { JSDOM } from "jsdom";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import {
	createToaster,
	Pagination,
	SettingsGroup,
	SettingsRow,
	Table,
	TableScrollArea,
} from "@codeui/react";

test("the package exposes its stylesheet alongside the server-renderable entry", async () => {
	const entry = await readFile(new URL(import.meta.resolve("@codeui/react")), "utf8");
	const styles = await readFile(
		new URL(import.meta.resolve("@codeui/react/style.css")),
		"utf8",
	);
	assert.match(entry, /^["']use client["']/);
	assert.match(styles, /--cui-surface-canvas:/);
	assert.match(styles, /\.cui-table-scroll-area/);
	assert.match(styles, /\.cui-pagination/);
});

test("pagination announces the current page and disables its end control", () => {
	const html = renderToString(h(Pagination, { pages: 12, page: 12, maxPages: 3 }));
	const document = JSDOM.fragment(html);
	assert.ok(document.querySelector('button[aria-current="page"][aria-label="Page 12"]'));
	assert.ok(document.querySelector('button[disabled][aria-label="Next page"]'));
	assert.doesNotMatch(html, /aria-label="Page 9"/);
	assert.equal(renderToString(h(Pagination, { pages: 0 })), "");
});

test("settings connect the row label and description to its control", () => {
	const html = renderToString(
		h(
			SettingsGroup,
			{ title: "Editor" },
			h(
				SettingsRow,
				{ id: "wrap", label: "Wrap lines", description: "Fit long lines." },
				props => h("button", props, "Toggle"),
			),
		),
	);
	assert.match(html, /id="wrap-label"[^>]*>Wrap lines/);
	assert.match(html, /id="wrap-description"[^>]*>Fit long lines/);
	assert.match(
		html,
		/<button aria-labelledby="wrap-label" aria-describedby="wrap-description"/,
	);
});

test("a named table scroll area receives keyboard focus and uses native table markup", () => {
	const html = renderToString(
		h(
			TableScrollArea,
			{ "aria-label": "Export sizes" },
			h(Table, { striped: true, size: "sm" }, h("caption", null, "Export sizes")),
		),
	);
	assert.match(html, /<div role="region" tabindex="0" aria-label="Export sizes"/i);
	assert.match(html, /<table[^>]*data-size="sm"[^>]*data-striped=""/);
	assert.match(html, /<caption>Export sizes<\/caption>/);
});

test(
	"a resolved toast expires with the default duration",
	{ timeout: 1000 },
	async () => {
		const toaster = createToaster({ duration: 20 });
		toaster.promise(Promise.resolve("image.png"), {
			loading: { description: "Exporting…" },
			success: name => ({ description: `Exported ${name}` }),
			error: { description: "Export failed." },
		});
		assert.equal(toaster.queue.visibleToasts.length, 1);
		assert.equal(toaster.queue.visibleToasts[0].timeout, undefined);
		await new Promise(resolve => setImmediate(resolve));
		assert.equal(toaster.queue.visibleToasts[0]?.timeout, 20);
		await new Promise(resolve => {
			const unsubscribe = toaster.queue.subscribe(() => {
				if (toaster.queue.visibleToasts.length === 0) {
					unsubscribe();
					resolve();
				}
			});
			toaster.queue.resumeAll();
		});
	},
);
