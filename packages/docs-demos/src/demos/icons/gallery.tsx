import { icons, Stack, Text } from "@codeui/kit";
import { For } from "solid-js";
const gallery = Object.entries(icons);
export default function Gallery() {
	return <Stack gap="4"><For each={gallery}>{([name, Icon]) => <Stack direction="row" align="center" gap="2"><Icon size="16px" aria-hidden="true" /><Text>{name}</Text></Stack>}</For></Stack>;
}
