import { tokens } from "@codeui/kit";
import { TokenTable, cssNames } from "./token-table";

export default function TokensRadii() {
	return <TokenTable kind="radius" names={cssNames(tokens.radius)} />;
}
