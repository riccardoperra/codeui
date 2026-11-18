import { Button } from "@codeui/kit";
import * as S from "@codeui/kit/sheet/parts";
export default function Demo() {
	return <S.Root modal={false}>
		<S.Trigger as={Button} variant="secondary">Open layers</S.Trigger>
		<S.Portal>
			<S.Content side="bottom">
				<S.Handle aria-label="Close layers" />
				<S.Header><S.Title>Layers</S.Title><S.CloseButton aria-label="Close layers" /></S.Header>
				<S.Description>Layers visible in the exported image.</S.Description>
				<S.Body><p>Background, window, code, and watermark.</p></S.Body>
				<S.Footer><S.CloseButton aria-label="Done with layers" /></S.Footer>
			</S.Content>
		</S.Portal>
	</S.Root>;
}
