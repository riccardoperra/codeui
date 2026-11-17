import { Switch, Button, Stack, Text } from "@codeui/kit";
import { createSignal } from "solid-js";
export default function Demo() {
	const [result, setResult] = createSignal("Submit to inspect");
	return (
		<form
			onSubmit={event => {
				event.preventDefault();
				setResult(
					new FormData(event.currentTarget).get("lineNumbers")?.toString() ?? "omitted",
				);
			}}
		>
			<Stack gap="3" align="start">
				<Switch
					label="Show line numbers"
					name="lineNumbers"
					value="include"
					defaultChecked
				/>
				<Stack direction="row" gap="3" align="center" wrap>
					<Button type="submit" size="sm">
						Inspect form value
					</Button>
					<Text as="output" size="caption" tone="muted">
						{result()}
					</Text>
				</Stack>
			</Stack>
		</form>
	);
}
