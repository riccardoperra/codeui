import { tokens } from "@codeui/kit";
import { TokenTable, cssNames } from "./token-table";

export default function TokensSpacing() {
	return <TokenTable kind="length" names={cssNames(tokens.space)} />;
}
