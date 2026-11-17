import { Link, Text, type TextVariants } from "@codeui/kit";
import { For } from "solid-js";
import "./showcase.css";

const scale: [name: string, sample: string, variants: TextVariants][] = [
	["Display, 18px", "Quarterly report", { size: "lg", weight: "semibold" }],
	["Title, 16px", "Billing details", { size: "md", weight: "semibold" }],
	["Label, 14px", "Payment method", { size: "sm", weight: "medium" }],
	["Base, 13px", "Invoices go to the billing email.", { size: "caption" }],
	["Meta, 12px", "Updated 2 hours ago", { size: "xs", tone: "muted" }],
];

export default function Typography() {
	return (
		<div class="showcase-stack" style={{ gap: "var(--cui-space-3)" }}>
			<For each={scale}>
				{([name, sample, variants]) => (
					<div class="showcase-specimen">
						<Text as="p" {...variants}>
							{sample}
						</Text>
						<span class="showcase-meta">{name}</span>
					</div>
				)}
			</For>
			<Text as="p" size="caption" tone="muted">
				The full scale is in <Link class="showcase-link" href="/docs/foundations/typography-and-spacing">typography and spacing</Link>.
			</Text>
		</div>
	);
}
