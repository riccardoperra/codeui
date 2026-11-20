import { render, fireEvent, cleanup } from "@solidjs/testing-library";
import { TextField } from "../src/components/TextField/TextField";
import { Button } from "../src/components/Button/Button";

afterEach(cleanup);

it("calls the click handler when the button is clicked", () => {
	const onClick = vi.fn();
	const { getByRole } = render(() => <Button onClick={onClick}>Save</Button>);
	fireEvent.click(getByRole("button", { name: "Save" }));
	expect(onClick).toHaveBeenCalledTimes(1);
});

it("links the text field label to its input", () => {
	const { getByLabelText, container } = render(() => <TextField label="Email address" />);
	const input = getByLabelText("Email address");
	expect(input.tagName).toBe("INPUT");
	expect(input.id).not.toBe("");
	expect(container.querySelector("label")?.htmlFor).toBe(input.id);
});
