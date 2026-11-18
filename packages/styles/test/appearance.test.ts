// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { applyStyleProps } from "@codeui/styles";
import { badgeStyleProps } from "@codeui/styles/badge";
import { button, buttonStyleProps } from "@codeui/styles/button";
import { dialogStyleProps } from "@codeui/styles/dialog";
import { iconButtonStyleProps } from "@codeui/styles/iconbutton";
import { stackStyleProps } from "@codeui/styles/stack";
import { switchStyleProps } from "@codeui/styles/switch";

describe("published appearance helpers", () => {
	it("preserves Button's base classes, default size and boolean attributes", () => {
		expect(buttonStyleProps({ class: "checkout", block: true, pill: false })).toEqual({
			class: `${button()} checkout`,
			"data-cui": "button",
			"data-size": "sm",
			"data-variant": undefined,
			"data-ghost": undefined,
			"data-block": "",
			"data-pill": undefined,
		});
		expect(iconButtonStyleProps({ size: "xs" })).toMatchObject({
			class: expect.stringContaining(button()),
			"data-size": "xs",
			"data-cui": "iconbutton",
		});
	});

	it("keeps Switch's named parts and uses the root when called directly", () => {
		expect(switchStyleProps()).toEqual(switchStyleProps.root());
		expect(switchStyleProps.control({ size: "sm" })).toEqual({
			class: "cui-switch-control",
			"data-cui": "switch-control",
			"data-size": "sm",
		});
		expect(switchStyleProps.control()["data-size"]).toBe("md");
	});

	it("applies compound defaults and keeps part options local", () => {
		expect(badgeStyleProps({ tone: "info" })).toMatchObject({
			"data-size": "sm",
			"data-tone": "info",
			"data-variant": "soft",
		});
		expect(dialogStyleProps.section({ variant: "well", columns: "2" })).toMatchObject({
			"data-cui": "dialog-section",
			"data-variant": "well",
			"data-columns": "2",
		});
		expect(stackStyleProps({ wrap: "false" })["data-wrap"]).toBe("false");
	});

	it("updates DOM appearance and removes stale variants while preserving adapter state", () => {
		const element = document.createElement("button");
		element.dataset.disabled = "";
		applyStyleProps(element, buttonStyleProps({ variant: "primary", block: true }));
		expect(element.getAttribute("data-block")).toBe("");
		expect(element.dataset.variant).toBe("primary");

		applyStyleProps(element, buttonStyleProps({ block: false, class: "updated" }));
		expect(element.getAttribute("data-block")).toBeNull();
		expect(element.getAttribute("data-variant")).toBeNull();
		expect(element.dataset.cui).toBe("button");
		expect(element.dataset.disabled).toBe("");
		expect(element.className).toBe(`${button()} updated`);
	});
});
