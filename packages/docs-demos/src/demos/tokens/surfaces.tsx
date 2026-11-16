import { tokens } from "@codeui/kit";
import { TokenTable, cssNames } from "./token-table";

export default function TokensSurfaces() {
	return <TokenTable kind="color" modes names={cssNames(tokens.surface)} />;
}
