import { createTheme } from "@vanilla-extract/css";
import { tokens } from "./tokens";

export const [theme, themeTokens] = createTheme({
	...tokens,
});
