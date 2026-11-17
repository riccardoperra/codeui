import { Button } from "@codeui/kit";
import "./unlayered-reset.css";

export default function CascadeUnlayeredReset() {
	return (
		<>
			<Button theme="primary">Export PNG</Button>
			<div class="unlayered-reset">
				<Button theme="primary">Export PNG</Button>
			</div>
		</>
	);
}
