import { cleanup, render, screen } from "solid-testing-library";
import { Select, type SelectProps } from "../src";
import { press, tick } from "./helpers";

afterEach(cleanup);

beforeAll(() => {
	window.scrollTo = () => {};
});

function submittedValues(form: HTMLFormElement, name: string) {
	return new FormData(form).getAll(name);
}

describe("Select in a form", () => {
	it("submits the selected value under its name", () => {
		render(() => (
			<form data-testid="form">
				<Select aria-label="Font" name="font" options={["Inter", "Mono"]} defaultValue="Mono" />
			</form>
		));
		const form = screen.getByTestId("form") as HTMLFormElement;
		expect(submittedValues(form, "font")).toEqual(["Mono"]);
	});

	it("submits the value the user picks with the keyboard", async () => {
		render(() => (
			<form data-testid="form">
				<Select aria-label="Font" name="font" options={["Inter", "Mono"]} />
			</form>
		));
		const form = screen.getByTestId("form") as HTMLFormElement;
		expect(submittedValues(form, "font")).toEqual([]);

		screen.getByRole("button", { name: /Font/ }).focus();
		press("ArrowDown");
		await tick();
		press("ArrowDown");
		press("Enter");
		await tick();
		expect(submittedValues(form, "font")).toEqual(["Mono"]);
	});

	it("submits every selected value when multiple", () => {
		render(() => (
			<form data-testid="form">
				<Select<string>
					aria-label="Fonts"
					name="fonts"
					multiple
					options={["Inter", "Mono", "Serif"]}
					defaultValue={["Inter", "Serif"]}
				/>
			</form>
		));
		const form = screen.getByTestId("form") as HTMLFormElement;
		expect(submittedValues(form, "fonts")).toEqual(["Inter", "Serif"]);
	});

	it("submits nothing when disabled", () => {
		render(() => (
			<form data-testid="form">
				<Select aria-label="Font" name="font" options={["Inter"]} defaultValue="Inter" disabled />
			</form>
		));
		expect(submittedValues(screen.getByTestId("form") as HTMLFormElement, "font")).toEqual([]);
	});

	it("takes its accessible name from label without aria-label", () => {
		const props: SelectProps<string> = { label: "Font", options: ["Inter"] };
		render(() => <Select {...props} />);
		expect(screen.getByRole("button", { name: /Font/ })).toBeInTheDocument();
	});
});
