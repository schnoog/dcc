import { defineConfig } from "tsup";

export default defineConfig((options) => ({
	entry: ["src/index.ts", "src/save.ts", ...(options.env && options.env.TEST ? ["src/scripts/generate.ts"] : [])],
	loader: {
		".template": "text",
		".lua": "text",
		".ogg": options.env && options.env.TEST ? "file" : "copy",
		".png": options.env && options.env.TEST ? "file" : "copy",
	},
	format: ["cjs", "esm"],
	clean: true,
	dts: true,
	platform: "node",
	esbuildOptions: (options) => {
		options.assetNames = "assets/[name]-[hash]";
	},
}));
