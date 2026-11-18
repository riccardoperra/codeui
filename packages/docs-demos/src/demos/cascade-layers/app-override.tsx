import { Button } from "@codeui/kit";
import "./app-override.css";

export default function CascadeAppOverride() {
	return (
		<>
			<Button variant="primary">Export PNG</Button>
			<Button variant="primary" class="export-pill">
				Export PNG
			</Button>
		</>
	);
}
