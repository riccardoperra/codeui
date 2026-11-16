import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { allPages } from './ia.mjs';
import { root } from './kit-exports.mjs';

export const manifestPath = path.join(root, 'apps/docs/export-manifest.json');
export const contentDir = path.join(root, 'apps/docs/content/docs/(kit)');

/** Heading id the way Fumadocs (github-slugger) builds it, for ASCII headings. */
export const slug = text =>
	text.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s/g, '-');

export function readManifest() {
	return JSON.parse(readFileSync(manifestPath, 'utf8'));
}

export function writeManifest(manifest) {
	writeFileSync(manifestPath, JSON.stringify(manifest, null, '\t') + '\n');
}

/** Types that the naming rules cannot place. Keyed by symbol, valid in any entry. */
const typeOwners = {
	BaseFieldProps: 'utilities/field-helpers#createbasefieldprops',
	FieldWithErrorMessageSupport: 'utilities/field-helpers#createfielderrormessageprops',
	FieldClasses: 'utilities/classes#fieldclasses',
	ComboboxOption: 'utilities/options-and-collections#createcomboboxoptions',
	ComboboxOptionsConfig: 'utilities/options-and-collections#createcomboboxoptions',
	CommandItem: 'utilities/options-and-collections#filtercommanditems',
	OptionCardEntry: 'utilities/control-helpers#createoptioncarditems',
	AccordionEntry: 'utilities/control-helpers#createaccordionitems',
	Gap: 'components/stack#stack',
	ToastAction: 'components/toast#createtoaster',
	ToastContent: 'components/toast#createtoaster',
	ToastContext: 'components/toast#createtoaster',
	ToastController: 'components/toast#createtoaster',
	ToastId: 'components/toast#createtoaster',
	ToastOptions: 'components/toast#createtoaster',
	ToastPromiseOptions: 'components/toast#createtoaster',
};

const variantSuffix = /(Variants|Variant|Size|Tone|Side|Motion|Position)$/;
const lowerFirst = s => s[0].toLowerCase() + s.slice(1);
const kebab = s => s.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`).replace(/^-/, '');

/**
 * Proposes a `page#anchor` for every export with the naming rules below. Used once to
 * pre-fill the manifest, and by `--add` for exports added later. The committed manifest
 * is the source of truth, so a reviewer can override any proposal by editing it.
 */
export function propose(exports) {
	const pages = allPages();
	const bySubpath = new Map(pages.filter(p => p.subpath).map(p => [p.subpath, p]));
	const owned = new Map();
	for (const page of pages) for (const symbol of page.owns ?? []) owned.set(symbol, `${page.slug}#${slug(symbol)}`);

	const partsPage = symbol => {
		const m = /^(\w+?)(Styles|Parts)$/i.exec(symbol);
		return m && bySubpath.get(kebab(lowerFirst(m[1])));
	};
	const forPartsSymbol = (page, symbol, kind) => {
		if (/Styles$/.test(symbol)) return `${page.slug}#${slug(lowerFirst(symbol))}`;
		if (kind === 'value' && /^[a-z]\w*Parts$/.test(symbol)) return `${page.slug}#anatomy`;
		return `${page.slug}#styled-parts-api`;
	};

	const rootValues = exports.filter(e => e.entry === '@codeui/kit' && e.kind === 'value').map(e => e.symbol);
	const rootAssignment = new Map();
	const out = {};
	const assign = (e, target) => {
		(out[e.entry] ??= {})[e.symbol] = target;
		if (e.entry === '@codeui/kit') rootAssignment.set(e.symbol, target);
	};

	for (const e of exports.filter(x => x.entry === '@codeui/kit')) {
		if (owned.has(e.symbol)) { assign(e, owned.get(e.symbol)); continue; }
		if (typeOwners[e.symbol]) { assign(e, typeOwners[e.symbol]); continue; }
		const parts = partsPage(e.symbol);
		if (parts) { assign(e, forPartsSymbol(parts, e.symbol, e.kind)); continue; }
		const owner = rootValues
			.filter(v => e.symbol.toLowerCase().startsWith(v.toLowerCase()) && owned.has(v))
			.sort((a, b) => b.length - a.length)[0];
		if (!owner) { assign(e, null); continue; }
		const page = owned.get(owner).split('#')[0];
		const hasParts = pages.find(p => p.slug === page)?.subpath;
		const suffix = e.symbol.slice(owner.length);
		if (hasParts && /^(Part|Classes)$/.test(suffix)) assign(e, `${page}#anatomy`);
		else if (hasParts && variantSuffix.test(suffix)) assign(e, `${page}#variants`);
		else assign(e, owned.get(owner));
	}

	for (const e of exports.filter(x => x.entry !== '@codeui/kit')) {
		const fromRoot = rootAssignment.get(e.symbol);
		const subpath = e.entry.slice('@codeui/kit/'.length);
		const page = bySubpath.get(subpath);
		if (fromRoot && !fromRoot.startsWith('utilities/styles-reference#') && (!page || fromRoot.startsWith(`${page.slug}#`) || fromRoot.startsWith('utilities/'))) {
			assign(e, fromRoot);
			continue;
		}
		if (!page) { assign(e, null); continue; }
		if (typeOwners[e.symbol]) { assign(e, typeOwners[e.symbol]); continue; }
		if (/(Styles|Parts)$/.test(e.symbol)) { assign(e, forPartsSymbol(page, e.symbol, e.kind)); continue; }
		if (e.kind === 'value') { assign(e, `${page.slug}#${slug(e.symbol)}`); continue; }
		const owner = /^(\w+)Props$/.exec(e.symbol)?.[1];
		const values = exports.filter(x => x.entry === e.entry && x.kind === 'value').map(x => x.symbol);
		if (owner && values.includes(owner)) assign(e, `${page.slug}#${slug(owner)}`);
		else if (/(Part|Classes)$/.test(e.symbol)) assign(e, `${page.slug}#anatomy`);
		else if (variantSuffix.test(e.symbol)) assign(e, `${page.slug}#variants`);
		else assign(e, `${page.slug}#styled-parts-api`);
	}
	return out;
}
