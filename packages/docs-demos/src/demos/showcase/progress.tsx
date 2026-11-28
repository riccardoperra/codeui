import { Button, Progress, Skeleton } from "@codeui/kit";
import { createSignal, onCleanup, Show } from "solid-js";
import "./showcase.css";

const files = 24;

export default function Upload() {
	const [done, setDone] = createSignal(files);
	const running = () => done() < files;
	let timer: ReturnType<typeof setInterval> | undefined;
	const start = () => {
		clearInterval(timer);
		setDone(0);
		timer = setInterval(() => {
			const next = Math.min(done() + 1, files);
			setDone(next);
			if (next === files) clearInterval(timer);
		}, 60);
	};
	onCleanup(() => clearInterval(timer));
	return (
		<div class="showcase-stack">
			<Progress label="Uploading files" value={done()} maxValue={files} showValue getValueLabel={({ value, max }) => `${value} of ${max}`} />
			<section class="showcase-preview" aria-label="Upload summary" aria-busy={running() ? "true" : "false"}>
				<Show
					when={running()}
					fallback={
						<>
							<p class="showcase-meta" style={{ color: "var(--cui-text-default)" }}>
								24 files uploaded
							</p>
							<p class="showcase-meta">48.2 MB, shared with 3 people</p>
						</>
					}
				>
					<Skeleton width="60%" height="var(--cui-space-3)" />
					<Skeleton width="85%" height="var(--cui-space-3)" />
					<Skeleton width="40%" height="var(--cui-space-3)" />
				</Show>
			</section>
			<div class="showcase-row" style={{ "justify-content": "flex-end" }}>
				<Button variant="secondary" size="sm" loading={running()} onClick={start}>
					Upload again
				</Button>
			</div>
		</div>
	);
}
