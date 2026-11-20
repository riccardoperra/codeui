import { For, Show, createSignal, onSettled } from "solid-js";
import { type JSX } from "@solidjs/web";

/** How a row previews its token. */
export type SwatchKind = "color" | "shadow" | "radius" | "length" | "font-size" | "value";

type Leaves = { readonly [key: string]: string | Leaves };

/** Every `--cui-*` name under a branch of `tokens`, in source order. */
export function cssNames(branch: Leaves): string[] {
	return Object.values(branch).flatMap(value =>
		typeof value === "string" ? [value.slice(4, -1)] : cssNames(value),
	);
}

const cell: JSX.CSSProperties = {
	padding: "8px 12px",
	"vertical-align": "middle",
	"text-align": "left",
};

const mono: JSX.CSSProperties = {
	"font-family": "var(--cui-font-family-mono)",
	"font-size": "var(--cui-font-size-xs)",
};

function Preview(props: { kind: SwatchKind; name: string }) {
	const token = () => `var(${props.name})`;
	switch (props.kind) {
		case "color":
			return (
				<span
					style={{
						display: "inline-block",
						width: "28px",
						height: "28px",
						"border-radius": "var(--cui-radius-xs)",
						background: token(),
						"box-shadow": "inset 0 0 0 1px #8888884d",
					}}
				/>
			);
		case "shadow":
			return (
				<span
					style={{
						display: "inline-block",
						width: "40px",
						height: "28px",
						"border-radius": "var(--cui-radius-xs)",
						background: "var(--cui-surface-dialog)",
						"box-shadow": token(),
					}}
				/>
			);
		case "radius":
			return (
				<span
					style={{
						display: "inline-block",
						width: "40px",
						height: "40px",
						"border-radius": token(),
						background: "var(--cui-surface-input)",
					}}
				/>
			);
		case "length":
			return (
				<span
					style={{
						display: "inline-block",
						width: token(),
						"max-width": "160px",
						height: "12px",
						background: "var(--cui-accent-selection)",
						"border-radius": "2px",
					}}
				/>
			);
		case "font-size":
			return (
				<span style={{ "font-size": token(), "line-height": 1.2 }}>Export snippet</span>
			);
		default:
			return null;
	}
}

const hex = (unit: number) =>
	Math.round(unit * 255)
		.toString(16)
		.padStart(2, "0");

/** `color(srgb r g b / a)` or `rgb(r, g, b, a)` → `#rrggbb` or `#rrggbbaa`. */
function toHex(color: string): string {
	const srgb = color.startsWith("color(srgb");
	const [r = 0, g = 0, b = 0, a = 1] = (color.match(/[\d.]+/g) ?? []).map(Number);
	const [red, green, blue] = srgb ? [r, g, b] : [r / 255, g / 255, b / 255];
	return `#${hex(red)}${hex(green)}${hex(blue)}${a === 1 ? "" : hex(a)}`;
}

/** A token computed from another one (`calc(…)`, `oklch(from …)`) shows the value it resolves to. */
function resolve(scope: HTMLElement, name: string, raw: string): string {
	if (!raw.includes("(") || raw.startsWith("cubic-bezier")) return raw;
	const probe = document.createElement("div");
	scope.append(probe);
	try {
		if (raw.startsWith("calc(")) {
			probe.style.borderRadius = `var(${name})`;
			return getComputedStyle(probe).borderTopLeftRadius;
		}
		probe.style.backgroundColor = `color-mix(in srgb, var(${name}) 100%, transparent)`;
		return toHex(getComputedStyle(probe).backgroundColor);
	} finally {
		probe.remove();
	}
}

/**
 * A table of `--cui-*` tokens with a preview per row. With `modes`, each row
 * shows the dark and the light value side by side, read from the browser.
 */
export function TokenTable(props: {
	names: string[];
	kind: SwatchKind;
	modes?: boolean;
}) {
	const [values, setValues] = createSignal<Record<string, string>>({});
	let dark!: HTMLDivElement;
	let light!: HTMLDivElement;
	let plain!: HTMLDivElement;
	onSettled(() => {
		const read = (el: HTMLElement, mode: string) => {
			const style = getComputedStyle(el);
			return Object.fromEntries(
				props.names.map(name => [
					`${mode}${name}`,
					resolve(el, name, style.getPropertyValue(name).trim()),
				]),
			);
		};
		setValues({ ...read(dark, "dark"), ...read(light, "light"), ...read(plain, "") });
	});
	const modeCell = (mode: "dark" | "light", name: string) => (
		<td style={cell}>
			<div
				data-cui-theme={mode}
				style={{
					display: "flex",
					"align-items": "center",
					gap: "10px",
					padding: "6px 8px",
					"border-radius": "var(--cui-radius-sm)",
					background: "var(--cui-surface-canvas)",
					color: "var(--cui-text-default)",
				}}
			>
				<Preview kind={props.kind} name={name} />
				<code style={mono}>{values()[`${mode}${name}`]}</code>
			</div>
		</td>
	);
	return (
		<div style={{ width: "100%", "overflow-x": "auto" }}>
			<div ref={dark} data-cui-theme="dark" hidden />
			<div ref={light} data-cui-theme="light" hidden />
			<div ref={plain} hidden />
			<table
				style={{
					width: "100%",
					"border-collapse": "collapse",
					color: "var(--cui-text-default)",
					"font-size": "var(--cui-font-size-caption)",
				}}
			>
				<thead>
					<tr>
						<th style={cell}>Token</th>
						<Show when={props.modes} fallback={<th style={cell}>Value</th>}>
							<th style={cell}>Dark</th>
							<th style={cell}>Light</th>
						</Show>
					</tr>
				</thead>
				<tbody>
					<For each={props.names}>
						{name => (
							<tr>
								<td style={cell}>
									<code style={mono}>{name}</code>
								</td>
								<Show
									when={props.modes}
									fallback={
										<td style={cell}>
											<div
												style={{ display: "flex", "align-items": "center", gap: "10px" }}
											>
												<Preview kind={props.kind} name={name} />
												<code style={mono}>{values()[name]}</code>
											</div>
										</td>
									}
								>
									{modeCell("dark", name)}
									{modeCell("light", name)}
								</Show>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
}
