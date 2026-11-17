import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig(({ isSsrBuild }) => ({
	plugins: [solid({ ssr: true }), vanillaExtractPlugin()],
	ssr: { noExternal: true },
	build: {
		outDir: isSsrBuild ? "dist/server" : "dist/client",
		minify: !isSsrBuild,
		lib: isSsrBuild
			? undefined
			: { entry: "src/client.tsx", formats: ["es"], fileName: "client", cssFileName: "demos" },
	},
}));
