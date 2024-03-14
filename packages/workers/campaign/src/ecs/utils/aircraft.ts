import * as DcsJs from "@foxdelta2/dcsjs";
import * as Types from "@kilcekru/dcc-shared-types";
import * as Utils from "@kilcekru/dcc-shared-utils";

import * as Entities from "../entities";
import { store } from "../store";

export function getUsableAircraftsByTask(args: {
	coalition: DcsJs.Coalition;
	task: Types.Campaign.CampaignTask;
	excludedAircrafts?: Set<Entities.Aircraft>;
}): Set<Entities.Aircraft> {
	let task: DcsJs.Task = "CAP";

	switch (args.task) {
		case "Escort":
			task = "CAP";
			break;
		case "DEAD":
			task = "Pinpoint Strike";
			break;
		default:
			task = args.task;
			break;
	}

	const desiredAircraftTypes = new Set(store.factionDefinitions[args.coalition]?.aircraftTypes[task]);

	const aircraftsPerAircraftType = new Map<DcsJs.AircraftType, Set<Entities.Aircraft>>();

	// Loop through all idle aircrafts
	for (const aircraft of store.queries.aircrafts[args.coalition].get("idle") ?? new Set()) {
		// Is the aircraft one of the desired types?
		if (desiredAircraftTypes.has(aircraft.aircraftData.name)) {
			// Is the aircraft not excluded?
			if (args.excludedAircrafts?.has(aircraft)) {
				continue;
			}

			// Map the aircraft to the aircraft type
			const prev = aircraftsPerAircraftType.get(aircraft.aircraftData.name);

			if (prev == null) {
				aircraftsPerAircraftType.set(aircraft.aircraftData.name, new Set([aircraft]));
			} else {
				prev.add(aircraft);
			}
		}
	}

	// Get the aircraft types with the minimum amount of aircrafts
	const aircraftTypeWithMinAmount: Array<DcsJs.AircraftType> = [];

	for (const [aircraftType, aircrafts] of aircraftsPerAircraftType) {
		if (aircrafts.size >= Utils.Config.packages[task].aircrafts) {
			aircraftTypeWithMinAmount.push(aircraftType);
		}
	}

	const selectedAircraftType = Utils.Random.item(aircraftTypeWithMinAmount);

	if (selectedAircraftType == null) {
		return new Set();
	}

	return aircraftsPerAircraftType.get(selectedAircraftType) ?? new Set();
}