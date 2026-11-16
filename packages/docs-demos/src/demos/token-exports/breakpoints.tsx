import { Text, breakpoints } from "@codeui/kit";
import { For } from "solid-js";

export default function Breakpoints() {
	return (
		<table style={{ "border-collapse": "collapse", color: "var(--cui-text-default)" }}>
			<tbody>
				<For each={Object.entries(breakpoints)}>
					{([name, width]) => (
						<tr>
							<td style={{ padding: "4px 16px 4px 0" }}>
								<Text size="caption" weight="medium">
									{name}
								</Text>
							</td>
							<td style={{ padding: "4px 0" }}>
								<Text size="caption" tone="muted">
									{`min-width: ${width}px`}
								</Text>
							</td>
						</tr>
					)}
				</For>
			</tbody>
		</table>
	);
}
