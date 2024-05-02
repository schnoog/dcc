import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
	site: "https://web.digitalcrewchief.at/",
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		react(),
		sitemap(),
	],
	output: "hybrid",
	adapter: cloudflare({
		mode: "directory",
	}),
	prefetch: true,
	images: passthroughImageService(),
});
