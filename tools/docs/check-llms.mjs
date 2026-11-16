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
const leaks = body => (body.match(/<SolidDemo|<PropsTable|<TypeTable/g) ?? []).length;

async function checkPage(slug) {
	const md = await get(`/docs/${slug}.md`);
	check(md.status === 200 && md.type.startsWith('text/markdown'), `/docs/${slug}.md is ${md.status} ${md.type}`);
	check(/^# .+\(\/docs\//.test(md.body), `/docs/${slug}.md starts with the page title`);
	check(!/<SolidDemo|<PropsTable|<TypeTable/.test(md.body), `/docs/${slug}.md has no unexpanded demo or props tags`);
	const txt = await get(`/docs/${slug}.txt`);
	check(txt.status === 200 && txt.type.startsWith('text/plain') && txt.body === md.body, `/docs/${slug}.txt matches the .md text`);
}

if (page) {
	await checkPage(page);
} else {
	const index = await get('/llms.txt');
	check(index.status === 200 && index.type.startsWith('text/plain'), `/llms.txt is ${index.status} ${index.type}`);
	check(/^# CodeUI kit \(@codeui\/kit \d/.test(index.body), '/llms.txt names the kit and its version');
	const links = [...index.body.matchAll(/\]\((\/[^)]+)\)/g)].map(m => m[1]);
	check(links.length > 60, `/llms.txt links ${links.length} files`);
	const broken = [];
	for (const link of links) if ((await get(link)).status !== 200) broken.push(link);
	check(broken.length === 0, `every /llms.txt link answers 200${broken.length ? `: ${broken.join(', ')}` : ''}`);

	const full = await get('/llms-full.txt');
	check(full.status === 200 && full.type.startsWith('text/plain'), `/llms-full.txt is ${full.status} ${full.type}`);
	const titles = full.body.match(/^# .+ \(\/docs[^)]*\)$/gm) ?? [];
	check(titles.length === new Set(titles).size, `/llms-full.txt has ${titles.length} pages, each once`);
	check(!titles.some(t => t.includes('(/docs/design')), '/llms-full.txt leaves out the Inkstone pages');
	// Draft pages may still hold authored TypeTables. Each lane's --page run fails on them.
	console.log(`info ${leaks(full.body)} unexpanded tags left in /llms-full.txt, from draft pages`);

	await checkPage('components/badge');
	await checkPage('components/dialog');
	const missing = await get('/docs/components/does-not-exist.md');
	check(missing.status === 404, `/docs/components/does-not-exist.md is ${missing.status}`);
}

if (failures.length) {
	console.error(`\n${failures.length} checks failed.`);
	process.exit(1);
}
console.log('\nAll checks passed.');
