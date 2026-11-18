import { badgeStyles } from "@codeui/kit/badge";
export default function PartStyle() {
	return <span class={badgeStyles.root()} data-size="md" data-tone="neutral" data-variant="soft"><span class={badgeStyles.label()}>PNG</span></span>;
}
