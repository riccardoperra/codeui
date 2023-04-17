import { createVar, fallbackVar, keyframes, style } from "@vanilla-extract/css";

const opacityAnimation = keyframes({
	"0%": {
		opacity: 0.2,
	},
	"20%": {
		opacity: 1,
	},
	"100%": {
		opacity: 0.2,
	},
});

export const wrapper = style({
	position: "absolute",
	left: 0,
	top: 0,
	width: "100%",
	height: "100%",
});

export const pointerAnimationDelay = createVar();

export const pointerGroup = style({
	display: "flex",
	position: "relative",
	inset: 0,
	width: "100%",
	height: "100%",
	alignItems: "center",
	justifyContent: "center",
	textAlign: "center",
	userSelect: "none",
	background: "transparent",
});

export const pointer = style({
	display: "inline-block",
	width: "0.25rem",
	height: "0.25rem",
	borderRadius: "50%",
	background: "currentColor",
	margin: "0px 1.5px",
	animation: `1.4s ease 0s infinite normal both running ${opacityAnimation}`,
	animationDelay: fallbackVar(pointerAnimationDelay, "0"),
});
