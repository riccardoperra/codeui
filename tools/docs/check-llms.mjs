#!/usr/bin/env node
// Checks the machine-readable docs routes of a running docs site.
//
//   node tools/docs/check-llms.mjs http://localhost:6150
//   node tools/docs/check-llms.mjs "$DOCS_URL" --page components/badge
//
// Build and serve first: pnpm --filter @codeui/docs build, then
// PORT=6150 node apps/docs/.output/server/index.mjs
const [base = process.env.DOCS_URL] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const page = process.argv.includes('--page') ? process.argv[process.argv.indexOf('--page') + 1] : null;
if (!base) throw new Error('Pass the docs URL, or set DOCS_URL.');

const failures = [];
const check = (ok, message) => {
	console.log(`${ok ? 'ok  ' : 'FAIL'} ${message}`);
	if (!ok) failures.push(message);
};
const get = async path => {
	const res = await fetch(new URL(path, base));
	return { status: res.status, type: res.headers.get('content-type') ?? '', body: await res.text() };
};
const leaks = body => (body.match(/<SolidDemo|<HtmlDemo|<CssPlayground|<PropsTable|<TypeTable/g) ?? []).length;

async function checkPage(slug) {
	const md = await get(`/docs/${slug}.md`);
	check(md.status === 200 && md.type.startsWith('text/markdown'), `/docs/${slug}.md is ${md.status} ${md.type}`);
	check(/^# .+\(\/docs\//.test(md.body), `/docs/${slug}.md starts with the page title`);
	check(!/<SolidDemo|<HtmlDemo|<CssPlayground|<PropsTable|<TypeTable/.test(md.body), `/docs/${slug}.md has no unexpanded demo or props tags`);
	const txt = await get(`/docs/${slug}.txt`);
	check(txt.status === 200 && txt.type.startsWith('text/plain') && txt.body === md.body, `/docs/${slug}.txt matches the .md text`);
}

if (page) {
	await checkPage(page);
} else {
	const index = await get('/llms.txt');
	check(index.status === 200 && index.type.startsWith('text/plain'), `/llms.txt is ${index.status} ${index.type}`);
	check(/^# CodeUI kit \(@codeui\/kit \d/.test(index.body), '/llms.txt names the kit and its version');
	check(index.body.includes('[Inkstone colour rules](/docs/design/color.md)'), '/llms.txt points to the colour rules');
	const links = [...index.body.matchAll(/\]\((\/[^)]+)\)/g)].map(m => m[1]);
	check(links.length > 60, `/llms.txt links ${links.length} files`);
	const broken = [];
	for (const link of links) if ((await get(link)).status !== 200) broken.push(link);
	check(broken.length === 0, `every /llms.txt link answers 200${broken.length ? `: ${broken.join(', ')}` : ''}`);

	const full = await get('/llms-full.txt');
	check(full.status === 200 && full.type.startsWith('text/plain'), `/llms-full.txt is ${full.status} ${full.type}`);
	const titles = full.body.match(/^# .+ \(\/docs[^)]*\)$/gm) ?? [];
	check(titles.length === new Set(titles).size, `/llms-full.txt has ${titles.length} pages, each once`);
	const designTitles = titles.filter(t => t.includes('(/docs/design'));
	check(designTitles.length === 1 && designTitles[0] === '# Colour (/docs/design/color)', '/llms-full.txt includes the Inkstone colour guide');
	const colour = await get('/docs/design/color.md');
	check(full.body.includes(colour.body.trim()), '/llms-full.txt includes the complete colour guide');
	check(/\| `surface\.island` \| `--cui-surface-canvas` \| `gray\.\d+` `#[\da-f]+` \| `gray\.\d+` `#[\da-f]+` \|/i.test(colour.body), 'Colour Markdown resolves generated palette roles');
	check(colour.body.includes('Use colours by role') && colour.body.includes('background-color: var(--cui-surface-field-hover)'), 'Colour Markdown contains rules and a CSS example');
	check(!/<ColourPalette|<PaletteComparison/.test(colour.body), 'Colour Markdown expands visual palette components');
	const tokens = await get('/docs/foundations/tokens.md');
	check(/^\| `blue\.500` \| `#[\da-f]+` \|[^|]*`--cui-action-brand-base`[^|]*\|[^|]*`--cui-action-brand-base`[^|]*\|$/im.test(tokens.body), 'Tokens Markdown maps the brand base to the same ramp step in both modes');
	check(/^\| `red\.300` \| `#[\da-f]+` \| — \| `--cui-text-danger` \|$/im.test(tokens.body), 'Tokens Markdown maps dark error text to red.300');
	check(!tokens.body.includes('<PaletteMatrix'), 'Tokens Markdown expands the palette matrix');
	// Draft pages may still hold authored TypeTables. Each lane's --page run fails on them.
	console.log(`info ${leaks(full.body)} unexpanded tags left in /llms-full.txt, from draft pages`);

	await checkPage('components/badge');
	await checkPage('components/dialog');
	await checkPage('design/color');
	const missing = await get('/docs/components/does-not-exist.md');
	check(missing.status === 404, `/docs/components/does-not-exist.md is ${missing.status}`);
}

if (failures.length) {
	console.error(`\n${failures.length} checks failed.`);
	process.exit(1);
}
console.log('\nAll checks passed.');
