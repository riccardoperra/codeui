import { fileURLToPath } from "node:url";

export const serverHtmlFile = fileURLToPath(
	new URL("../../.hydration/server.json", import.meta.url),
);
