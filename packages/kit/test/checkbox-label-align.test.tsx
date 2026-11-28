import { cleanup, render } from "@solidjs/testing-library";
import { Checkbox } from "../src/components/CheckBox/CheckBox";

afterEach(cleanup);

it.each([undefined, "xs", "sm", "md", "lg", "xl"] as const)(
	"centers the %s label on the box",
	size => {
		const { container, getByText } = render(() => (
			<Checkbox size={size} label="Show line numbers" />
		));
		const box = container.querySelector(
			'[data-cui="check-box-control"], .cui-checkbox-control',
		)!;
		const label = getByText("Show line numbers");
		const range = document.createRange();
		range.selectNodeContents(label);
		const text = range.getBoundingClientRect();
		const b = box.getBoundingClientRect();
		const off = text.top + text.height / 2 - (b.top + b.height / 2);
		expect(Math.abs(off)).toBeLessThanOrEqual(1);
	},
);
