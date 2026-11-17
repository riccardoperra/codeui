import { badgeStyles } from "@codeui/kit/badge";
export default function PartStyle() {
	return <span class={badgeStyles.root({ size: "md", tone: "neutral", variant: "soft" })}><span class={badgeStyles.label()}>PNG</span></span>;
}
