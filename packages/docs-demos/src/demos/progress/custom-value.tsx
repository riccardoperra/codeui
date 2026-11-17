import * as P from "@codeui/kit/progress";

export default function Demo() {
	return (
		<P.Root
			value={12}
			maxValue={24}
			getValueLabel={({ value, max }) => `${value} of ${max} frames`}
		>
			<P.Label>Export frames</P.Label>
			<P.ValueLabel />
			<P.Track>
				<P.Fill />
			</P.Track>
		</P.Root>
	);
}
