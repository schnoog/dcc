import * as DcsJs from "@foxdelta2/dcsjs";
import { DataStore } from "@kilcekru/dcc-shared-rpc-types";
import { createUniqueId } from "solid-js";

import { Scenario } from "../../data/scenarios";
import { firstItem, getScenarioFaction, onboardNumber } from "../../utils";
import { getLoadoutForAircraftType } from "../utils";

export const generateAircraftInventory = (
	coalition: DcsJs.CampaignCoalition,
	faction: DcsJs.FactionDefinition,
	scenario: Scenario,
	dataStore: DataStore
) => {
	const airdromes = dataStore.airdromes;

	if (airdromes == null) {
		throw "airdromes not found";
	}

	const airdrome = airdromes[coalition === "blue" ? "Kobuleti" : "Mozdok"];

	const capCount = 12;
	const casCount = 4;
	const awacsCount = 3;
	const strikeCount = 6;
	const deadCount = 4;

	if (faction == null) {
		throw "faction not found";
	}

	if (airdrome == null) {
		throw "airdrome not found";
	}

	const aircrafts: Array<DcsJs.CampaignAircraft> = [];
	const farpName = firstItem(getScenarioFaction(coalition, scenario).farps);

	faction.aircraftTypes.cap.forEach((acType) => {
		const count = Math.max(2, capCount * faction.aircraftTypes.cap.length);
		const aircraftType = acType as DcsJs.AircraftType;

		Array.from({ length: count }, () => {
			aircrafts.push({
				aircraftType,
				state: "idle",
				id: createUniqueId(),
				availableTasks: ["CAP"],
				alive: true,
				onboardNumber: onboardNumber(),
				homeBase: {
					name: airdrome.name,
					type: "airdrome",
				},
				loadout: getLoadoutForAircraftType(aircraftType, "default", dataStore),
			});
		});
	});

	faction.aircraftTypes.cas.forEach((acType) => {
		const count = Math.max(2, casCount * faction.aircraftTypes.cap.length);
		const aircraft = dataStore.aircrafts?.[acType as DcsJs.AircraftType];
		const aircraftType = acType as DcsJs.AircraftType;

		Array.from({ length: count }, () => {
			aircrafts.push({
				aircraftType,
				homeBase:
					aircraft?.isHelicopter && farpName != null
						? {
								type: "farp",
								name: farpName,
						  }
						: {
								type: "airdrome",
								name: airdrome.name,
						  },
				state: "idle",
				id: createUniqueId(),
				availableTasks: ["CAS"],
				alive: true,
				onboardNumber: onboardNumber(),
				loadout: getLoadoutForAircraftType(aircraftType, "default", dataStore),
			});
		});
	});

	faction.aircraftTypes.awacs.forEach((acType) => {
		const count = Math.max(2, awacsCount * faction.aircraftTypes.cap.length);
		const aircraftType = acType as DcsJs.AircraftType;

		Array.from({ length: count }, () => {
			aircrafts.push({
				aircraftType,
				homeBase: {
					name: airdrome.name,
					type: "airdrome",
				},
				state: "idle",
				id: createUniqueId(),
				availableTasks: ["AWACS"],
				alive: true,
				onboardNumber: onboardNumber(),
				loadout: getLoadoutForAircraftType(aircraftType, "default", dataStore),
			});
		});
	});

	faction.aircraftTypes.strike.forEach((acType) => {
		const count = Math.max(2, strikeCount * faction.aircraftTypes.strike.length);
		const aircraftType = acType as DcsJs.AircraftType;

		Array.from({ length: count }, () => {
			aircrafts.push({
				aircraftType,
				homeBase: {
					name: airdrome.name,
					type: "airdrome",
				},
				state: "idle",
				id: createUniqueId(),
				availableTasks: ["Pinpoint Strike"],
				alive: true,
				onboardNumber: onboardNumber(),
				loadout: getLoadoutForAircraftType(aircraftType, "default", dataStore),
			});
		});
	});

	faction.aircraftTypes.dead.forEach((acType) => {
		const count = Math.max(2, deadCount * faction.aircraftTypes.strike.length);
		const aircraftType = acType as DcsJs.AircraftType;

		Array.from({ length: count }, () => {
			aircrafts.push({
				aircraftType,
				homeBase: {
					name: airdrome.name,
					type: "airdrome",
				},
				state: "idle",
				id: createUniqueId(),
				availableTasks: ["DEAD"],
				alive: true,
				onboardNumber: onboardNumber(),
				loadout: getLoadoutForAircraftType(aircraftType, "default", dataStore),
			});
		});
	});

	const aircraftRecord: Record<string, DcsJs.CampaignAircraft> = {};

	aircrafts.forEach((ac) => {
		aircraftRecord[ac.id] = ac;
	});

	return aircraftRecord;
};
