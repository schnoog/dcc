import * as DcsJs from "@foxdelta2/dcsjs";

export const destroyAircraft = (faction: DcsJs.CampaignFaction, id: string, timer: number) => {
	const aircraft = faction.inventory.aircrafts[id];

	if (aircraft == null) {
		return;
	}

	aircraft.alive = false;
	aircraft.destroyedTime = timer;
};