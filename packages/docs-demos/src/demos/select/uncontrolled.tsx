import { Select } from "@codeui/kit";

const formats = ["PNG", "SVG", "JPEG", "WebP"];

export default function SelectUncontrolledDemo() {
	return (
		<Select
			aria-label="Export format"
			label="Export format"
			options={formats}
			defaultValue="PNG"
			onChange={format => console.log("Export as", format)}
		/>
	);
}
