import { Button } from "@codeui/kit";
import * as S from "@codeui/kit/sheet";
import { createSignal, Show } from "solid-js";
export default function Demo() {
	const [mount, setMount] = createSignal<HTMLDivElement>();
	return <S.Root modal={false}>
		<div style={{ position: "relative", height: "360px", width: "100%" }}>
			<S.Trigger as={Button} theme="secondary">Open docked layers</S.Trigger>
			<div ref={setMount} style={{ position: "absolute", inset: "48px 0 0" }} />
			<Show when={mount()}>{target => <S.Portal mount={target()}>
				<S.Content style={{ position: "absolute", "max-height": "100%" }}>
					<S.Handle aria-label="Close layers" />
					<S.Header><S.Title>Layers</S.Title><S.CloseButton aria-label="Close layers" /></S.Header>
					<S.Body>Background, window, code, and watermark.</S.Body>
				</S.Content>
			</S.Portal>}</Show>
		</div>
	</S.Root>;
}
