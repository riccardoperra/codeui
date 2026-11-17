import { tokens } from "@codeui/kit";
import { TokenTable, cssNames } from "./token-table";

export default function TokensShadows() {
	return <TokenTable kind="shadow" modes names={cssNames(tokens.shadow)} />;
}
