import { Progress, Stack } from "@codeui/kit";
import * as P from "@codeui/kit/progress";

export default function Demo() {
	return (
		<Stack gap="3">
			<Progress label="Queued frames" value={0} showValue />
			<Progress label="Export frames" value={60} showValue />
			<Progress label="Export complete" value={100} showValue />
			<P.Root indeterminate>
				<P.Label>Preparing export</P.Label>
				<div class={P.progressStyles.valueLabel()}>Preparing…</div>
				<P.Track>
					<P.Fill />
				</P.Track>
			</P.Root>
		</Stack>
	);
}
