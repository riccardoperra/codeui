import { Badge, Stack, Text } from "@codeui/kit";

// Before, with @codeimage/ui:
//   <HStack spacing="2" alignItems="center"> ... </HStack>
//   <VStack spacing="1"> ... </VStack>
//   <Text size="xs" weight="semibold"> ... </Text>
export default function Layout() {
	return (
		<Stack gap="3">
			<Stack direction="row" gap="2" align="center">
				<Text as="h3" size="md" weight="semibold">
					hello-world.ts
				</Text>
				<Badge>Draft</Badge>
			</Stack>
			<Stack gap="1">
				<Text tone="muted">Edited 2 minutes ago</Text>
				<Text size="xs" tone="hint">
					Exports as PNG, 2x
				</Text>
			</Stack>
		</Stack>
	);
}
