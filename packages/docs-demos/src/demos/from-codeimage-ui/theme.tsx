import { Stack, Text } from "@codeui/kit";
import "./theme.css";

export default function ThemeAttribute() {
	return (
		<Stack direction="row" gap="4" wrap>
			<div data-cui-theme="dark" class="project-card">
				<Text weight="semibold">Dark UI</Text>
				<div class="frame" data-codeimage-frame-mode="light">
					Light frame
				</div>
			</div>
			<div data-cui-theme="light" class="project-card">
				<Text weight="semibold">Light UI</Text>
				<div class="frame" data-codeimage-frame-mode="dark">
					Dark frame
				</div>
			</div>
		</Stack>
	);
}
