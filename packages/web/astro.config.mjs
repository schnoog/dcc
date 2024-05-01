import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		react(),
	],
	output: "hybrid",
	adapter: cloudflare({
		mode: "directory",
	}),
	image: {
		service: passthroughImageService(),
	},
	prefetch: true,
});
