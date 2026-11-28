import { Kbd, Stack, Text } from "@codeui/kit";
import { createSignal, onSettled, Show } from "solid-js";

/** True on macOS, iOS and iPadOS. Reads the browser, so call it only after mount. */
function isApplePlatform() {
	return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
}

export default function KbdPlatform() {
	// The server cannot know the platform. Render Ctrl first, then switch after hydration.
	const [apple, setApple] = createSignal(false);
	onSettled(() => { setApple(isApplePlatform()); });

	return (
		<Stack direction="row" gap="4" align="center" justify="between">
			<Text>Copy snippet</Text>
			<Stack as="kbd" direction="row" gap="1" align="center">
				<Show when={apple()} fallback={<Kbd>Ctrl</Kbd>}>
					<Kbd>⌘</Kbd>
				</Show>
				<Kbd>C</Kbd>
			</Stack>
		</Stack>
	);
}
