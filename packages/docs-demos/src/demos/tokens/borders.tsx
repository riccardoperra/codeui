import { tokens } from "@codeui/kit";
import { TokenTable, cssNames } from "./token-table";

export default function TokensBorders() {
	return (
		<>
			<TokenTable
				kind="color"
				modes
				names={cssNames({
					dialogTitle: tokens.border.dialogTitle,
					divider: tokens.border.divider,
					input: tokens.border.input,
					menu: tokens.border.menu,
				})}
			/>
			<TokenTable kind="length" names={cssNames({ width: tokens.border.width, widthStrong: tokens.border.widthStrong })} />
		</>
	);
}
