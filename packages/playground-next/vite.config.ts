import solid from "solid-start/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from "@codeimage/vanilla-extract";

export default defineConfig({
	// @ts-ignore
	plugins: [solid({ ssr: false }), vanillaExtractPlugin(), tsconfigPaths()],
});
