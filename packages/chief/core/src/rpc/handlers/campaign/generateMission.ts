import * as DcsJs from "@foxdelta2/dcsjs";
import * as Types from "@kilcekru/dcc-shared-types";
import * as Utils from "@kilcekru/dcc-shared-utils";

import { createFlightGroup } from "./createFlightgroup";
import { mapGroundGroup, mapSamGroup, mapStructure } from "./dcsJsMapper";

export async function createMission(
	campaign: Types.Serialization.UIStateEntitiesArray,
	getEntity: <Entity extends Types.Serialization.EntitySerialized>(id: Types.Campaign.Id) => Entity,
): Promise<DcsJs.Mission> {
	const mission = new DcsJs.Mission({
		id: campaign.missionId,
		date: new Date(campaign.date),
		time: campaign.time,
		theatre: campaign.theatre,
		weather: {
			cloudCover: 0,
			cloudCoverData: [],
			offset: 0,
			temperature: 20,
			wind: {
				direction: 0,
				speed: 0,
			},
		},
		aiSkill: campaign.campaignParams.aiSkill,
		airdromes: {
			blue: new Set(campaign.airdromes.blue),
			red: new Set(campaign.airdromes.red),
			neutrals: new Set(campaign.airdromes.neutrals),
		},
		countries: {
			blue: campaign.factionDefinitions.blue?.countryName ?? "USA",
			red: campaign.factionDefinitions.red?.countryName ?? "Russia",
			neutrals: "Switzerland",
		},
		hotStart: campaign.campaignParams.hotStart,
	});

	// Loop through all entities in the campaign and ads them to the mission
	for (const entity of campaign.entities.values()) {
		if (entity.entityType === "GroundGroup") {
			const props = mapGroundGroup(entity, campaign, getEntity);

			if (props == null) {
				continue;
			}

			mission.createGroundGroup(props);
		}

		if (entity.entityType === "SAM") {
			const samProps = mapSamGroup(entity, campaign, getEntity);

			if (samProps == null) {
				continue;
			}

			mission.createSamGroup(samProps);
		}

		// Structures
		if (entity.entityType === "GenericStructure" || entity.entityType === "UnitCamp" || entity.entityType === "Farp") {
			const staticProps = mapStructure(entity, campaign, getEntity);

			if (staticProps == null) {
				continue;
			}

			mission.createStaticGroup(staticProps);
		}

		// Flight Group
		if (entity.entityType.includes("FlightGroup")) {
			const fg = entity as Types.Serialization.FlightGroupSerialized;

			const fgProps = createFlightGroup(fg, campaign, getEntity);

			if (fgProps == null) {
				continue;
			}

			mission.createFlightGroup(fgProps);
		}
	}

	mission.generateAWACS({
		blue: Utils.Random.item(campaign.factionDefinitions.blue?.aircraftTypes["AWACS"] ?? []) ?? "E-3A",
		red: Utils.Random.item(campaign.factionDefinitions.red?.aircraftTypes["AWACS"] ?? []) ?? "A-50",
	});

	return mission;
}
