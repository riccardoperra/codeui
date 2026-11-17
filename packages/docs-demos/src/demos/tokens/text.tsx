import { tokens } from "@codeui/kit";
import { TokenTable, cssNames } from "./token-table";

export default function TokensText() {
	return <TokenTable kind="color" modes names={cssNames(tokens.text)} />;
}
