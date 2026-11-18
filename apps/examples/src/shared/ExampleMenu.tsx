import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	IconButton,
	Link,
	Tooltip,
} from "@codeui/kit";
import BookOpen from "lucide-solid/icons/book-open";
import Code from "lucide-solid/icons/code";
import Ellipsis from "lucide-solid/icons/ellipsis";
import LayoutGrid from "lucide-solid/icons/layout-grid";
import Moon from "lucide-solid/icons/moon";
import Sun from "lucide-solid/icons/sun";
import { type JSX, Show } from "solid-js";
import { docsUrl, sourceUrl } from "./examples";
import { createControlSize } from "./size";
import { theme, toggleTheme } from "./theme";

const open = (url: string) => window.location.assign(url);

/**
 * The header's last control in every example: the theme, and the way back to the docs, the other
 * examples and this example's source. `children` adds app rows above them.
 */
export function ExampleMenu(props: { slug: string; children?: JSX.Element }) {
	const size = createControlSize();
	return (
		<DropdownMenu placement="bottom-end">
			{/* The neutral tooltip: the accent is never a surface (DESIGN.md §2.3). */}
			<Tooltip content="More" placement="bottom" variant="secondary">
				<DropdownMenuTrigger as={IconButton} variant="secondary" ghost size={size()} aria-label="More">
					<Ellipsis size={16} />
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuPortal>
				<DropdownMenuContent>
					<Show when={props.children}>
						{props.children}
						<DropdownMenuSeparator />
					</Show>
					<DropdownMenuItem onSelect={toggleTheme}>
						<span class="ex-menu-icon">
							<Show when={theme() === "dark"} fallback={<Moon size={16} />}>
								<Sun size={16} />
							</Show>
						</span>
						{theme() === "dark" ? "Light theme" : "Dark theme"}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={() => open("../")}>
						<span class="ex-menu-icon">
							<LayoutGrid size={16} />
						</span>
						All examples
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => open(docsUrl)}>
						<span class="ex-menu-icon">
							<BookOpen size={16} />
						</span>
						CodeUI docs
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => open(sourceUrl(props.slug))}>
						<span class="ex-menu-icon">
							<Code size={16} />
						</span>
						View source
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
}

/** The credit line. One per example, in a quiet corner of its chrome. */
export function MadeWith() {
	return (
		<span class="ex-made-with">
			Made with <Link href={docsUrl}>CodeUI</Link>
		</span>
	);
}
