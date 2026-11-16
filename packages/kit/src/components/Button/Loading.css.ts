import { tokens } from "../../foundation/cui.css";
import { transition } from "../../foundation/motion.css";
import { style } from "../../foundation/layer.css";
import { createVar, fallbackVar, keyframes } from "@vanilla-extract/css";

const wrapperAnimation = keyframes({
	"0%": {
		opacity: 0,
	},
	"100%": {
		opacity: 1,
	},
});

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
	background: "inherit",
	opacity: 0,
	transition: transition(["opacity"], tokens.motion.duration.normal),
	animation: `${wrapperAnimation} ${tokens.motion.duration.normal} ${tokens.motion.ease.out}`,
	animationFillMode: "forwards",
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
	width: tokens.space["1"],
	height: tokens.space["1"],
	borderRadius: tokens.radius.full,
	background: "currentColor",
	margin: "0px 1.5px",
	animation: `1.4s ease 0s infinite normal both running ${opacityAnimation}`,
	animationDelay: fallbackVar(pointerAnimationDelay, "0"),
});
