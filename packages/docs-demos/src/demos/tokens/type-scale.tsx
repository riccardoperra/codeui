import { tokens } from "@codeui/kit";
import { TokenTable, cssNames } from "./token-table";

export default function TokensTypeScale() {
	return (
		<>
			<TokenTable kind="font-size" names={cssNames(tokens.font.size)} />
			<TokenTable
				kind="value"
				names={cssNames({
					family: tokens.font.family,
					weight: tokens.font.weight,
					lineHeight: tokens.font.lineHeight,
					tracking: tokens.font.tracking,
				})}
			/>
		</>
	);
}
