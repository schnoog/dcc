import type * as DcsJs from "@foxdelta2/dcsjs";
import { z } from "zod";

export type DataStore = {
	map: DcsJs.MapName;
	aircrafts: Partial<Record<DcsJs.AircraftType, DcsJs.DCS.Aircraft>> | undefined;
	groundUnitsTemplates: DcsJs.GetGroundUnitsTemplates | undefined;
	airdromes: DcsJs.GetMapData["airdromes"] | undefined;
	objectives: DcsJs.GetMapData["objectives"] | undefined;
	strikeTargets: DcsJs.GetMapData["strikeTargets"] | undefined;
	mapInfo: DcsJs.GetMapData["info"] | undefined;
	samTemplates: DcsJs.GetSamTemplates | undefined;
	vehicles: DcsJs.GetVehicles | undefined;
	structures: DcsJs.GetStructures | undefined;
	callSigns: DcsJs.GetCallSigns | undefined;
	launchers: DcsJs.GetLaunchers | undefined;
	weapons: DcsJs.GetWeapons | undefined;
	ships: DcsJs.GetShips | undefined;
	tasks: DcsJs.GetTasks | undefined;
};

export type MissionState = {
	killed_aircrafts: Array<string>;
	killed_ground_units: Array<string>;
	mission_ended: boolean;
	downed_pilots: Array<{
		name: string;
		coalition: number;
		time: number;
		x: number;
		y: number;
	}>;
	group_positions: Array<{
		name: string;
		x: number;
		y: number;
	}>;
	time: number;
	mission_id: string;
};

export namespace Schema {
	export const campaignSynopsis = z.object({
		id: z.string(),
		factionName: z.string().optional(),
		active: z.boolean(),
		name: z.string(),
		countryName: z.string().optional(),
		created: z.coerce.date(),
		edited: z.coerce.date(),
		timer: z.number(),
		version: z.number().optional(),
	});
}

export type CampaignSynopsis = z.infer<typeof Schema.campaignSynopsis>;

export interface BriefingDocument {
	package: DcsJs.FlightPackage;
	flightGroup: DcsJs.FlightGroup;
	faction: DcsJs.CampaignFaction;
	dataAircrafts: Partial<Record<DcsJs.AircraftType, DcsJs.DCS.Aircraft>>;
	mapData: DcsJs.MapData;
}

export type StructurePlan = {
	structureName: string;
	structureType: string;
};
export type ObjectivePlan = {
	objectiveName: string;
	structures: Array<StructurePlan>;
	groundUnitTypes: Array<string>;
};

export type DynamicObjectivePlan = ObjectivePlan & { objective: DcsJs.Import.Objective };

export type ScenarioCoalition = {
	airdromeNames: Array<string>;
	carrierObjective?: string;
	objectivePlans: Array<ObjectivePlan>;
};
export type Scenario = {
	map: string;
	id: string;
	available: boolean;
	name: string;
	era: string;
	date: string;
	briefing: string;
	"blue-start-objective-range": [number, number];
	"win-condition":
		| {
				type: "ground units";
		  }
		| {
				type: "objective";
				value: string;
		  };
	blue: ScenarioCoalition;
	red: ScenarioCoalition;
};

export type StructureMapItem = {
	name: string;
	type: "structure";
	coalition: DcsJs.Coalition;
	position: DcsJs.Position;
	structureType: DcsJs.StructureType;
};

export type AirdromeMapItem = {
	name: string;
	type: "airdrome";
	coalition: DcsJs.Coalition;
	position: DcsJs.Position;
};

export type GroundGroupMapItem = {
	name: string;
	type: "groundGroup";
	coalition: DcsJs.Coalition;
	position: DcsJs.Position;
};

export type MapEntityMapItem = {
	type: "unknown";
	coalition: DcsJs.Coalition;
	position: DcsJs.Position;
};

export type MapItem = StructureMapItem | AirdromeMapItem | GroundGroupMapItem | MapEntityMapItem;

export type WorkerMessage =
	| { name: "resume" }
	| { name: "pause" }
	| {
			name: "generate";
			payload: {
				blueFactionDefinition: DcsJs.Faction;
				redFactionDefinition: DcsJs.Faction;
				scenario: Scenario;
			};
	  }
	| {
			name: "setDataStore";
			payload: DataStore;
	  };

export type WorkerEventTick = { name: "tick"; dt: number };
export type WorkerEventMapUpdate = { name: "mapUpdate"; items: Set<MapItem> };

export type WorkerEvent = WorkerEventTick | WorkerEventMapUpdate;
