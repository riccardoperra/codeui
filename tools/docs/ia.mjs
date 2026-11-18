/**
 * The docs information architecture: sidebar groups, every planned page, and which lane owns it.
 * `tools/docs/scaffold.mjs` writes the sidebar `meta.json` files and the draft stubs from this file.
 * `tools/docs/coverage.mjs` maps kit exports to these pages.
 *
 * Page fields:
 * - `slug`: path under `apps/docs/content/docs/(kit)/`, without `.mdx`. The URL is `/docs/<slug>`.
 * - `kind`: `guide`, `component`, or `utility`. It picks the stub template.
 * - `lane`: the unit from the docs plan that writes the page. See LANES.md.
 * - `owns` (components and utilities): the root `@codeui/kit` value exports documented on the page.
 *   Types attach to their owner by name. Subpath exports attach through `subpath`.
 * - `subpath`: the `@codeui/kit/<subpath>/parts` styled-parts entry documented on a component page.
 * - `todo`: what the page must cover, copied into the stub.
 */

const component = (slug, title, description, lane, owns, subpath, todo) => ({
	slug: `components/${slug}`,
	title,
	description,
	kind: 'component',
	lane,
	owns,
	subpath,
	todo,
});

export const families = [
	{
		title: 'Actions',
		pages: [
			component('button', 'Button', 'A clickable action, styled by theme, size, and variant.', '04', ['Button'], null,
				'Five themes primary, secondary, tertiary, caution, negative. Five field sizes. Ghost, pill, block, leftIcon, loading, disabled, polymorphic usage.'),
			component('icon-button', 'IconButton', 'A button that shows only an icon and carries an accessible name.', '04', ['IconButton'], null,
				'Same theme and size families as Button, pill, loading, disabled, accessible name.'),
			component('link', 'Link', 'A styled anchor for navigation inside text or toolbars.', '04', ['Link'], null,
				'Default, underline, disabled, polymorphic anchor.'),
		],
	},
	{
		title: 'Layout and text',
		pages: [
			component('kbd', 'Kbd', 'A keycap that shows a key or a keyboard shortcut.', '05', ['Kbd'], 'kbd',
				'sm and md, keycap and hint, shortcut chords.'),
			component('settings-row', 'SettingsRow', 'Settings rows with a label, a description, and a control, grouped on islands.', '14', ['SettingsRow', 'SettingsGroup', 'createSettingsRowProps'], 'settings',
				'inline and wide, compactControl stacking below 900px, markers, pictures, details, controlId labels, disabled controls, long labels, styled parts and createSettingsRowProps.'),
			component('stack', 'Stack', 'A flex container that spaces its children with token gaps.', '05', ['Stack'], 'stack',
				'Row and column, wrap, align start, center, end, stretch, baseline, justify start, center, end, between, around, evenly. Every Gap value.'),
			component('text', 'Text', 'Text set in the kit type scale, with tones and polymorphic headings.', '05', ['Text'], 'text',
				'Every font size and weight token, tones default, muted, hint, label, danger, success, polymorphic headings.'),
		],
	},
	{
		title: 'Fields and selection',
		pages: [
			component('checkbox', 'Checkbox', 'A box that toggles one option on or off.', '07', ['Checkbox'], 'checkbox',
				'Five field sizes, checked, unchecked, indeterminate where inherited, required, disabled, invalid.'),
			component('combobox', 'Combobox', 'A text input that filters a list of options as the user types.', '08', ['Combobox'], 'combobox',
				'sm and md, open and closed, empty, required, disabled, readOnly, invalid, string and object options, helper, parts focus.'),
			component('number-field', 'NumberField', 'A text field for numbers, with steppers, limits, and formatting.', '06', ['NumberField', 'NumberFieldLabel'], 'number-field',
				'Three field themes, five sizes, min and max, precision, step, prefix and postfix, disabled, readOnly, required, invalid.'),
			component('option-card', 'OptionCard', 'A group of large selectable cards, each with a label, a description, and an optional preview.', '14', ['OptionCardGroup', 'OptionCard'], 'option-card',
				'card and tile, previews, badges, disabled group and item, invalid, long labels, controlled union values. OptionCard is the item and OptionCardGroup is the ready group.'),
			component('radio-list', 'RadioList', 'A list of radio buttons for choosing one option.', '07', ['RadioList', 'RadioListItem'], 'radio-list',
				'Five field sizes, horizontal and vertical, disabled entries, validation, field content.'),
			component('segmented-control', 'SegmentedControl', 'A row of mutually exclusive segments for switching between a few options.', '07', ['SegmentedControl', 'SegmentedControlItem'], 'segmented-control',
				'Five field sizes, neutral and primary, solid and bordered, pill, fluid, autoWidth, disabled group and item, field content, Escape in an overlay.'),
			component('select', 'Select', 'A button that opens a list of options and shows the chosen one.', '08', ['Select'], 'select',
				'Three field themes, five sizes, disabled, readOnly, required, invalid, object options, the createSelectOptions helper, listbox classes.'),
			component('slider', 'Slider', 'A thumb on a track for choosing a number in a range.', '07', ['Slider'], 'slider',
				'Horizontal and vertical, value display, scalar controlled and uncontrolled, min, max, and step, disabled, readOnly, required, invalid, focus.'),
			component('switch', 'Switch', 'A toggle that turns a setting on or off immediately.', '07', ['Switch'], 'switch',
				'sm and md, checked and unchecked, disabled, readOnly, required, invalid, focus.'),
			component('text-area', 'TextArea', 'A multi-line text field.', '06', ['TextArea', 'TextAreaLabel'], 'text-area',
				'Three field themes, five sizes, autoResize, disabled, readOnly, required, invalid, custom classes. TextArea intentionally shares the text-field data-cui names.'),
			component('text-field', 'TextField', 'A single-line text input with a label, a description, and an error message.', '06', ['TextField', 'TextFieldLabel'], 'text-field',
				'Three field themes, five sizes, disabled, readOnly, required, invalid, descriptions, input ARIA, custom classes.'),
		],
	},
	{
		title: 'Navigation and collections',
		pages: [
			component('accordion', 'Accordion', 'Stacked sections that expand one at a time to show their content.', '11', ['Accordion'], 'accordion',
				'Ready single-open and collapsible, retained content, disabled entries. Parts compact and comfortable density, multiple selection, motion auto and none. Density and multiple selection belong to parts only.'),
			component('listbox', 'Listbox', 'A list of selectable options that stays visible on the page.', '09', ['Listbox', 'ListboxItem'], 'listbox',
				'xs, sm, and md, primary and neutral, bordered, single and multiple selection, custom item labels, field content.'),
			component('pagination', 'Pagination', 'Buttons for moving between pages of a long result set.', '09', ['Pagination'], 'pagination',
				'Supported Button sizes, rounded, first, previous, next, and last boundaries, count changes.'),
			component('tabs', 'Tabs', 'A row of tabs that switches between panels of content.', '09', ['Tabs', 'TabsHeader', 'TabsList', 'TabsContent'], 'tabs',
				'default and inline, horizontal and vertical where supported, controlled state, dynamic tabs, keyboard focus.'),
			component('virtualized-listbox', 'VirtualizedListbox', 'A Listbox that renders only the visible rows of a long collection.', '09', ['VirtualizedListbox'], null,
				'Virtualized collection, size-dependent row heights, scroll to selection, empty and long collections, selection contract inherited from Listbox.'),
		],
	},
	{
		title: 'Feedback',
		pages: [
			component('alert', 'Alert', 'A message inside the page that reports a status.', '12', ['Alert'], 'alert',
				'All five tones, icon visibility, title and action, fluid true and false.'),
			component('badge', 'Badge', 'A short, non-interactive status label.', '12', ['Badge'], 'badge',
				'sm and md, soft and outline, all five status tones, icon and rich label.'),
			component('progress', 'Progress', 'A bar that shows how much of a task is done.', '12', ['Progress'], 'progress',
				'sm and md, determinate and indeterminate, value label, custom accessible text.'),
			component('skeleton', 'Skeleton', 'A placeholder shape shown while content loads.', '12', ['Skeleton'], 'skeleton',
				'Visible loading and revealed content, circle, width, height, and radius, animate true and false, reduced motion.'),
			component('spinner', 'Spinner', 'An animated indicator for work of unknown length.', '12', ['Spinner'], 'spinner',
				'sm, md, and lg, custom label, busy button, reduced motion.'),
			component('toast', 'Toast', 'Short notifications that appear over the page and dismiss themselves.', '13', ['Toaster', 'createToaster'], 'toast',
				'All five tones, six viewport positions, message only, action, rich content, loading and promise, progress, persistence, focused action, multiple controllers. The createToaster section covers show, update, dismiss, clear, promise, IDs, ownership, the queue lifecycle, and request-local SSR.'),
		],
	},
	{
		title: 'Overlays',
		pages: [
			component('command-menu', 'CommandMenu', 'A searchable palette of commands opened from the keyboard.', '15', ['CommandMenu'], 'command-menu',
				'Open and closed, empty, grouped items, disabled items, leading, check, description, and shortcut, query filtering, highlighted preview, close lifecycle, parts.'),
			component('dialog', 'Dialog', 'A modal window over the page, for a decision that blocks the user.', '10', ['Dialog', 'DialogPanel', 'DialogPanelContent', 'DialogPanelFooter'], 'dialog',
				'xs, sm, md, lg, xl, and full, overflow, controlled and uncontrolled, titles and descriptions, parts composition, focus restoration.'),
			component('dropdown-menu', 'DropdownMenu', 'A menu of actions opened from a trigger.', '10',
				['DropdownMenu', 'DropdownMenuContent', 'DropdownMenuPortal', 'DropdownMenuItem', 'DropdownMenuTrigger', 'DropdownSubMenu', 'DropdownSubMenuTrigger', 'DropdownSubMenuContent', 'DropdownMenuSeparator'], 'dropdown-menu',
				'Flat and nested menus, disabled items, separators, custom trigger, nested Escape and focus return.'),
			component('popover', 'Popover', 'A floating panel anchored to a trigger, for content the user opens on demand.', '10', ['Popover', 'PopoverTrigger', 'PopoverContent'], 'popover',
				'Default and bordered, supported placements, custom position and gutter, block children, parts composition.'),
			component('sheet', 'Sheet', 'A panel that slides in from an edge of the screen.', '11', ['Sheet'], 'sheet',
				'bottom, left, and right, motion auto and none, drag handle and cancellation, docked parts, modal and focus behavior.'),
			component('tooltip', 'Tooltip', 'A short label that appears on hover or focus.', '10', ['Tooltip'], 'tooltip',
				'primary and secondary, supported placements, disabled, custom JSX trigger, keyboard and pointer activation.'),
		],
	},
];

const guide = (slug, title, description, lane, todo) => ({ slug, title, description, kind: 'guide', lane, todo });
const utility = (slug, title, description, lane, owns, todo) => ({ slug: `utilities/${slug}`, title, description, kind: 'utility', lane, owns, todo });

/** Sidebar groups in order. A string entry is a link item for `meta.json`. */
export const groups = [
	{
		title: 'Getting started',
		pages: [
			guide('index', 'Introduction', null, '02', 'Tutorial entry point. What the kit is, the ready components and styled parts layers, and where to go next.'),
			guide('installation', 'Installation', null, '02', 'Install the kit in a plain Solid and Vite app, verified against the packed package.'),
			guide('first-component', 'First component', 'Render a kit component in a Solid app and customize it.', '02',
				'Tutorial. The reader builds one screen with a ready component, sees it render on the server and hydrate, then changes one token.'),
			guide('ready-or-parts', 'Choose ready components or parts', 'When to use a ready component, and when to compose the styled parts.', '02',
				'Explanation. The three layers, what each one owns, the styled-part subpaths, and the cost of stepping down a layer.'),
		],
	},
	{
		title: 'Foundations',
		pages: [
			guide('foundations/tokens', 'Tokens', 'The --cui-* custom properties every kit style reads.', '03',
				'Explain the token contract. Link the token tables in the Token exports utility page instead of copying them.'),
			guide('foundations/theming', 'Theming', null, '03', 'Light and dark scopes, data-cui-theme, overriding tokens per app, per mode, and per subtree.'),
			guide('foundations/cascade-layers', 'Cascade layers', 'How kit styles are layered, and how app styles override them.', '03',
				'The layer order, how to override from app CSS, and the verified override example.'),
			guide('foundations/typography-and-spacing', 'Typography and spacing', 'The type scale and the spacing scale the components use.', '03',
				'Font size and weight tokens, regenerated from keyof tokens.font.size and tokens.font.weight. The Gap scale.'),
			guide('foundations/motion', 'Motion', 'The durations and easings the kit uses, and how it respects reduced motion.', '03',
				'Motion tokens, which components animate, and the prefers-reduced-motion behavior.'),
			guide('foundations/accessibility', 'Accessibility', 'What the kit guarantees for keyboard, screen readers, and focus, and what stays your job.', '03',
				'The Kobalte engine contract, focus rings, accessible names, and the checks each component page records.'),
			'[Inkstone design principles](/docs/design)',
		],
	},
	{ title: 'Components', folder: 'components' },
	{
		title: 'Patterns',
		pages: [
			guide('patterns/compose-styled-parts', 'Compose styled parts', 'Build reusable Solid components from styled parts.', '16',
				'How-to. Turn styled parts into an app-level primitive with a reusable layout.'),
			guide('patterns/build-forms', 'Build forms', 'Combine fields into a form with labels, descriptions, and validation.', '06',
				'How-to. A real form submission with TextField, TextArea, NumberField, and the field helpers.'),
			guide('patterns/nest-overlays', 'Nest overlays', 'Open a popover, menu, or tooltip inside a dialog.', '10',
				'How-to. Nested Escape, focus return, and portal mounts.'),
			guide('patterns/build-settings', 'Build settings', 'Lay out a settings panel with option cards, switches, and segmented controls.', '14',
				'How-to. Group and item distinction, previews, long labels, keyboard.'),
			guide('patterns/run-commands', 'Run commands', 'Wire a command menu to your app\'s actions and shortcuts.', '15',
				'How-to. Filtering, highlight preview, selection, and the close lifecycle.'),
			guide('patterns/show-notifications', 'Show notifications', 'Report the result of an action with toasts.', '13',
				'How-to. One toaster per request on the server, actions, promises, and independent controllers.'),
		],
	},
	{
		title: 'Utilities',
		pages: [
			utility('options-and-collections', 'Options and collections', 'Helpers that turn your data into options for Select, Combobox, and CommandMenu.', '08',
				['createSelectOptions', 'createComboboxOptions', 'filterCommandItems'],
				'Input data, accessors, mapping, generics, return shape, empty and missing values, reactive update examples.'),
			utility('field-helpers', 'Field helpers', 'Helpers that wire labels, descriptions, and errors into custom fields.', '06',
				['createBaseFieldProps', 'createFieldLabelProps', 'createFieldErrorMessageProps', 'styleFieldMessage'],
				'Reactive inputs, return contracts, labels and validation. styleFieldMessage requires vanilla-extract at build time.'),
			utility('control-helpers', 'Control helpers', 'Helpers that map your data to Switch, Slider, OptionCard, and Accordion props.', '07',
				['createSwitchProps', 'createSliderProps', 'createOptionCardItems', 'createAccordionItems'],
				'Checked and value mapping, form inputs, reactive entries, metadata versus content, usage boundaries.'),
			utility('styles-reference', 'Styles reference', 'The style exports of the kit, and where each one is documented.', '16',
				['buttonStyles', 'fieldStyles', 'fieldErrorStyles', 'fieldLabelStyles', 'textFieldStyles', 'dropdownMenuStyles', 'popoverStyles'],
				'One section per legacy style namespace: recipes, strings, theme variables, and variant types. Link each component\'s Styles export section for the part functions.'),
			utility('token-exports', 'Token exports', 'The JavaScript token objects and the @codeui/kit/tokens entry.', '03',
				['tokens', 'themeTokens', 'themeVars', 'breakpoints', 'layoutVars', 'responsiveStyle'],
				'One section per symbol. The @codeui/kit/tokens entry: named exports, parity with the root, side effects, packed-consumer behavior.'),
			utility('classes', 'Classes', 'How to pass classes to the kit and how the kit joins them.', '16',
				['mergeClasses'],
				'mergeClasses accepted values and joining behavior. It does not resolve Tailwind conflicts. FieldClasses keys.'),
			utility('icons', 'Icons', 'The icons the kit ships and the SvgIcon wrapper.', '16',
				['icons', 'SvgIcon'],
				'Rendered gallery of CheckIcon, ChevronDownIcon, ChevronUpIcon, CloseIcon, NextIcon, PreviousIcon, SelectorIcon. Size, color inheritance, accessible and decorative usage.'),
		],
	},
	{
		title: 'Migration',
		pages: [
			guide('migration/from-codeimage-ui', 'From @codeimage/ui', 'Move a CodeImage screen from @codeimage/ui to @codeui/kit.', '17',
				'Exact import and behavior mappings. Every import compiles.'),
			guide('migration/from-0-1', 'From 0.1.x', 'Upgrade an app from @codeui/kit 0.1.x.', '17',
				'Exact import and behavior mappings. Every import compiles.'),
		],
	},
	{
		title: 'Contributing',
		pages: [
			guide('contributing/add-a-component', 'Add a component', 'Add a component to the kit, from the part to the ready export.', '18',
				'Maintainer procedure. Parts, ready component, exports, API report, stories, docs.'),
			guide('contributing/add-docs-and-demos', 'Add docs and demos', 'Write a component page and its Solid demos.', '02',
				'Maintainer procedure, published from apps/docs/CONTRIBUTING-DOCS.md.'),
			guide('contributing/verify-accessibility-and-ssr', 'Verify accessibility and SSR', 'Check a component for keyboard, screen readers, and server rendering.', '18',
				'Maintainer procedure. Both themes, keyboard focus, narrow viewport, long labels, SSR hydration.'),
		],
	},
	{
		title: 'Agent reference',
		pages: [
			guide('agents', 'API reference for agents', 'Imports, signatures, and limits of @codeui/kit in one page, for coding agents.', '17',
				'Exact public import paths, ready exports, parts conventions, controlled state, field helpers, token names, SSR toast ownership, and known unavailable APIs. Link full component references.'),
		],
	},
];

/** Every page, in sidebar order. */
export function allPages() {
	return groups.flatMap(g => (g.folder ? families.flatMap(f => f.pages) : g.pages.filter(p => typeof p !== 'string')));
}
