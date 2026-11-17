import { Button } from "@codeui/kit";
import { For, createSignal, onMount } from "solid-js";

const durations = ["fast", "normal", "panel", "slow"] as const;

export default function MotionDurations() {
	const [moved, setMoved] = createSignal(false);
	const [reduced, setReduced] = createSignal(false);
	onMount(() => setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches));
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-3)", width: "100%", "max-width": "420px" }}>
			<For each={durations}>
				{name => (
					<div style={{ display: "flex", "align-items": "center", gap: "var(--cui-space-3)" }}>
						<code style={{ width: "220px", "font-size": "var(--cui-font-size-xs)" }}>
							--cui-motion-duration-{name}
						</code>
						<div style={{ flex: 1, height: "12px", position: "relative" }}>
							<span
								style={{
									position: "absolute",
									left: 0,
									width: "12px",
									height: "12px",
									"border-radius": "var(--cui-radius-full)",
									background: "var(--cui-accent-selection)",
									// Reduced motion keeps the fade and drops the movement.
									transform: reduced() ? "none" : `translateX(${moved() ? 140 : 0}px)`,
									opacity: reduced() && moved() ? 0.4 : 1,
									transition: `transform var(--cui-motion-duration-${name}) var(--cui-motion-ease-out), opacity var(--cui-motion-duration-${name}) var(--cui-motion-ease-out)`,
								}}
							/>
						</div>
					</div>
				)}
			</For>
			<div>
				<Button theme="secondary" size="sm" onClick={() => setMoved(!moved())}>
					Play
				</Button>
			</div>
		</div>
	);
}
