import { Button } from "@codeui/kit";
import "./app-override.css";

export default function CascadeAppOverride() {
	return (
		<>
			<Button theme="primary">Export PNG</Button>
			<Button theme="primary" class="export-pill">
				Export PNG
			</Button>
		</>
	);
}
