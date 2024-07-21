import * as DcsJs from "@foxdelta2/dcsjs";
import * as Types from "@kilcekru/dcc-shared-types";

export function getCountryForCoalition(
	coalition: DcsJs.Coalition,
	campaign: Types.Serialization.UIStateEntitiesArray,
): DcsJs.CountryName {
	switch (coalition) {
		case "blue":
			return campaign.factionDefinitions.blue?.countryName ?? "USA";
		case "red":
			return campaign.factionDefinitions.red?.countryName ?? "Russia";
		default:
			return "USA";
	}
}

export function groundGroupName(entity: Types.Serialization.GroundGroupSerialized) {
	return `${entity.name}/${entity.id}`;
}
