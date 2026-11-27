import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { Avatar } from "../src/components/Avatar/Avatar";
import { avatarHue, avatarInitials } from "../src/parts/avatar";

afterEach(cleanup);

describe("Avatar", () => {
	it("names the image with the person's name and shows their initials", () => {
		render(() => <Avatar name="Ada Lovelace" identifier="user_42" />);
		const avatar = screen.getByRole("img", { name: "Ada Lovelace" });
		expect(avatar).toHaveAttribute("data-cui", "avatar");
		expect(avatar).toHaveAttribute("data-size", "xs");
		expect(avatar).toHaveTextContent("AL");
		expect(avatar.querySelector("[data-cui=avatar-fallback]")).toHaveAttribute("aria-hidden", "true");
	});

	it("derives the hue from the id, not the name", () => {
		render(() => (
			<>
				<Avatar name="Ada Lovelace" identifier="user_42" data-testid="a" />
				<Avatar name="Grace Hopper" identifier="user_42" data-testid="b" />
				<Avatar name="Ada Lovelace" identifier="user_7" data-testid="c" />
			</>
		));
		const hue = (id: string) => screen.getByTestId(id).style.getPropertyValue("--cui-avatar-hue");
		expect(hue("a")).toBe(String(avatarHue("user_42")));
		expect(hue("b")).toBe(hue("a"));
		expect(hue("c")).not.toBe(hue("a"));
	});

	it("is neutral without an id", () => {
		render(() => <Avatar name="Guest" />);
		const avatar = screen.getByRole("img", { name: "Guest" });
		expect(avatar.style.getPropertyValue("--cui-avatar-chroma")).toBe("0");
		expect(avatar.style.getPropertyValue("--cui-avatar-hue")).toBe("");
	});

	it("shows the picture over the initials and falls back when it fails", () => {
		render(() => <Avatar name="Ada Lovelace" identifier="u" src="/missing.png" />);
		const image = document.querySelector<HTMLImageElement>("[data-cui=avatar-image]")!;
		expect(image).toHaveAttribute("alt", "");
		fireEvent.error(image);
		expect(document.querySelector("[data-cui=avatar-image]")).toBeNull();
		expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveTextContent("AL");
	});

	it("renders an unassigned state as an empty circle named Unassigned", () => {
		render(() => <Avatar unassigned />);
		const avatar = screen.getByRole("img", { name: "Unassigned" });
		expect(avatar).toHaveAttribute("data-unassigned", "");
		expect(avatar).toBeEmptyDOMElement();
	});

	it("wraps the avatar in the kit tooltip unless turned off", () => {
		render(() => (
			<>
				<Avatar name="Ada Lovelace" />
				<Avatar name="Grace Hopper" tooltip={false} />
			</>
		));
		expect(screen.getByRole("img", { name: "Ada Lovelace" }).parentElement).toHaveAttribute(
			"data-cui",
			"tooltip-trigger",
		);
		expect(screen.getByRole("img", { name: "Grace Hopper" }).parentElement).not.toHaveAttribute(
			"data-cui",
			"tooltip-trigger",
		);
	});
});

describe("avatarInitials", () => {
	it("takes one or two initials", () => {
		expect(avatarInitials("Ada Lovelace")).toBe("AL");
		expect(avatarInitials("Ada King Lovelace")).toBe("AL");
		expect(avatarInitials("ada")).toBe("A");
		expect(avatarInitials("  ")).toBe("");
		expect(avatarInitials("Émile Zola")).toBe("ÉZ");
	});
});
