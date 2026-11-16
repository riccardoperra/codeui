import { tokens } from "@codeui/kit";
import { TokenTable, cssNames } from "./token-table";

export default function TokensMotion() {
	return <TokenTable kind="value" names={cssNames(tokens.motion)} />;
}
