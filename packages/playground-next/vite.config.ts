import solid from "solid-start/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from "@codeui/vanilla-extract";

export default defineConfig({
	// @ts-ignore
	plugins: [vanillaExtractPlugin(), solid({ ssr: false }), tsconfigPaths()],
});
