import { tokens } from "@codeui/kit";
import { TokenTable, cssNames } from "./token-table";

export default function TokensStatus() {
	return (
		<TokenTable
			kind="color"
			modes
			names={cssNames({
				danger: tokens.action.danger,
				caution: tokens.action.caution,
				success: tokens.action.success,
			})}
		/>
	);
}
