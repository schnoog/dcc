import * as Types from "@kilcekru/dcc-shared-types";
import { z } from "zod";

import { MultiJson } from "./multiJson";

export const CampaignPersistance = new MultiJson({
	name: "campaign/campaign",
	version: 1,
	schema: {
		item: z.object({
			id: z.string(),
			name: z.string(),
			factionName: z.string(),
			countryName: z.string(),
			edited: z.coerce.date(),
			active: z.boolean(),
			version: z.number(),
			time: z.number(),
		}),
		synopsis: Types.Campaign.Schema.campaignSynopsis,
	},
	getSynopsis: (item) => ({
		id: item.id,
		active: item.active,
		version: item.version ?? 0,
		edited: item.edited,
		name: item.name,
		factionName: item.factionName,
		countryName: item.countryName,
		time: item.time,
	}),
});
