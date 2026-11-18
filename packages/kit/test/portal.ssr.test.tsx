import { renderToString } from "solid-js/web";
import { Dialog } from "../src/components/Dialog/Dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../src/components/Popover/Popover";
import * as D from "../src/parts/dialog";
import * as P from "../src/parts/popover";

it.each([true, false])("server renders Dialog content only while open=%s", open => {
	const html = renderToString(() => (
		<Dialog open={open} title="Dialog title">
			Dialog body
		</Dialog>
	));
	expect(html.includes("Dialog body")).toBe(open);
	expect(html.includes('role="dialog"')).toBe(open);
});

it.each([true, false])("server renders Popover content only while open=%s", open => {
	const html = renderToString(() => (
		<Popover open={open}>
			<PopoverTrigger>Open popover</PopoverTrigger>
			<PopoverContent title="Popover title">Popover body</PopoverContent>
		</Popover>
	));
	expect(html).toContain("Open popover");
	expect(html.includes("Popover body")).toBe(open);
});

it("server renders force-mounted closed portal content", () => {
	const html = renderToString(() => (
		<>
			<D.Root open={false} forceMount>
				<D.Portal>
					<D.Content>Forced dialog</D.Content>
				</D.Portal>
			</D.Root>
			<P.Root open={false} forceMount>
				<P.Portal>
					<P.Content>Forced popover</P.Content>
				</P.Portal>
			</P.Root>
		</>
	));
	expect(html).toContain("Forced dialog");
	expect(html).toContain("Forced popover");
});

import * as Sheet from "../src/parts/sheet";
import * as Command from "../src/parts/command-menu";
it("server renders default-open dialogs and derived dialog portals", () => {
	const html = renderToString(() => (
		<>
			<Dialog defaultOpen title="Default dialog">
				Default dialog body
			</Dialog>
			<Popover defaultOpen>
				<PopoverTrigger>Default popover trigger</PopoverTrigger>
				<PopoverContent>Default popover body</PopoverContent>
			</Popover>
			<Sheet.Root defaultOpen>
				<Sheet.Portal>
					<Sheet.Content>
						<Sheet.Title>Sheet title</Sheet.Title>Sheet body
					</Sheet.Content>
				</Sheet.Portal>
			</Sheet.Root>
			<Command.Root defaultOpen>
				<Command.Portal>
					<Command.Content options={["Export"]}>
						<Command.Search>
							<Command.SearchInput aria-label="Search commands" />
						</Command.Search>
						<Command.Listbox />
					</Command.Content>
				</Command.Portal>
			</Command.Root>
		</>
	));
	for (const text of [
		"Default dialog body",
		"Default popover body",
		"Sheet body",
		"Search commands",
	])
		expect(html).toContain(text);
});
