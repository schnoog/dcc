import * as DcsJs from "@foxdelta2/dcsjs";
import { createUniqueId } from "solid-js";

import { Scenario } from "../../data";
import { randomItem } from "../../utils";

export const generateGroundUnitsInventory = (
	faction: DcsJs.FactionDefinition,
	coalition: DcsJs.CampaignCoalition,
	scenario: Scenario
) => {
	const vehicles: Array<DcsJs.CampaignUnit> = faction.template.vehicles.map((name) => {
		return {
			id: "",
			name: name,
			displayName: name,
			alive: true,
			category: "Armor",
			state: "idle",
			vehicleTypes: ["Armored"],
		};
	});

	const infantries: Array<DcsJs.CampaignUnit> = faction.template.infantries.map((name) => {
		return {
			id: "",
			name: name,
			displayName: name,
			alive: true,
			category: "Infantry",
			state: "idle",
			vehicleTypes: ["Infantry"],
		};
	});

	const shoradVehicles: Array<DcsJs.CampaignUnit> = faction.template.shoradVehicles.map((name) => {
		return {
			id: "",
			name,
			displayName: name,
			alive: true,
			category: "Air Defence",
			state: "idle",
			vehicleTypes: ["SHORAD"],
		};
	});

	const shoradInfantries: Array<DcsJs.CampaignUnit> = faction.template.shoradInfantries.map((name) => {
		return {
			id: "",
			name,
			displayName: name,
			alive: true,
			category: "Air Defence",
			state: "idle",
			vehicleTypes: ["SHORAD", "Infantry"],
		};
	});

	const groundUnits: Record<string, DcsJs.CampaignUnit> = {};

	if (vehicles.length > 0) {
		const unitCount = 80 / vehicles.length;

		vehicles.forEach((unit) => {
			Array.from({ length: unitCount }, () => {
				const id = createUniqueId();

				groundUnits[id] = {
					...unit,
					id,
					displayName: `${unit.name}|${id}`,
				};
			});
		});
	}

	if (infantries.length > 0) {
		const unitCount = 120 / infantries.length;

		infantries.forEach((unit) => {
			Array.from({ length: unitCount }, () => {
				const id = createUniqueId();

				groundUnits[id] = {
					...unit,
					id,
					displayName: `${unit.name}|${id}`,
				};
			});
		});
	}

	if (shoradVehicles.length > 0) {
		const unitCount = 30 / shoradVehicles.length;

		shoradVehicles.forEach((unit) => {
			Array.from({ length: unitCount }, () => {
				const id = createUniqueId();

				groundUnits[id] = {
					...unit,
					id,
					displayName: `${unit.name}|${id}`,
				};
			});
		});
	}

	if (shoradInfantries.length > 0) {
		const unitCount = 30 / shoradVehicles.length;

		shoradInfantries.forEach((unit) => {
			Array.from({ length: unitCount }, () => {
				const id = createUniqueId();

				groundUnits[id] = {
					...unit,
					id,
					displayName: `${unit.name}|${id}`,
				};
			});
		});
	}

	scenario[coalition === "blue" ? "blue" : "red"].objectivePlans.forEach((plan) => {
		const hasEWR = plan.groundUnitTypes.some((gut) => gut === "ewr");

		if (!hasEWR) {
			return;
		}

		const name = randomItem(faction.template.ews);

		if (name == null) {
			return;
		}

		const id = createUniqueId();
		const unit: DcsJs.CampaignUnit = {
			id,
			name: name,
			displayName: `${name}|${id}`,
			alive: true,
			category: "Air Defence",
			state: "idle",
			vehicleTypes: ["Unarmored", "EW"],
		};

		groundUnits[id] = unit;
	});

	return groundUnits;
};
