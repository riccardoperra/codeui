import { tokens } from "@codeui/kit";
import { TokenTable, cssNames } from "./token-table";

export default function TokensAction() {
	return (
		<TokenTable
			kind="color"
			modes
			names={cssNames({
				neutral: tokens.action.neutral,
				brand: tokens.action.brand,
				brandSoft: tokens.action.brandSoft,
				accent: tokens.accent,
			})}
		/>
	);
}
