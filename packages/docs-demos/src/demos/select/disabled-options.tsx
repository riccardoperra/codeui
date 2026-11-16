import { Select } from "@codeui/kit";

type Format = { id: string; name: string; available: boolean };

const formats: Format[] = [
	{ id: "png", name: "PNG", available: true },
	{ id: "svg", name: "SVG", available: true },
	{ id: "pdf", name: "PDF (coming soon)", available: false },
	{ id: "webp", name: "WebP", available: true },
];

export default function SelectDisabledOptionsDemo() {
	return (
		<Select
			aria-label="Export format"
			label="Export format"
			options={formats}
			optionValue="id"
			optionTextValue="name"
			optionDisabled={format => !format.available}
			itemLabel={format => format.name}
			valueComponent={format => format().name}
			defaultValue={formats[0]}
		/>
	);
}
