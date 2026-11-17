import { fileURLToPath } from "node:url";
export const serverHtmlFile = fileURLToPath(new URL("../../.hydration/server.json", import.meta.url));
export const portalHtmlFile = fileURLToPath(new URL("../../.hydration/portals.json", import.meta.url));
