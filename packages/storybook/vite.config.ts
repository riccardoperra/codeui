import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import solidPlugin from "@solidjs/vite-plugin";

export default defineConfig({
	plugins: [tsconfigPaths(), solidPlugin()],
});
