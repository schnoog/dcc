import * as DcsJs from "@foxdelta2/dcsjs";
import * as Types from "@kilcekru/dcc-shared-types";

import { getCountryForCoalition, groundGroupName } from "./utils";

export function mapGroundGroup(
	groundGroup: Types.Serialization.GroundGroupSerialized,
	campaign: Types.Serialization.UIStateEntitiesArray,
	getEntity: <Entity extends Types.Serialization.EntitySerialized>(id: Types.Campaign.Id) => Entity,
): DcsJs.InputTypes.GroundGroup | undefined {
	if (groundGroup.queries.includes("groundGroups-embarked")) {
		return;
	}

	const units = [];
	let target: Types.Serialization.ObjectiveSerialized | undefined = undefined;

	for (const id of groundGroup.unitIds) {
		const groundUnit = getEntity<Types.Serialization.GroundUnitSerialized>(id);

		if (groundUnit == null) {
			continue;
		}

		if (groundUnit.alive === false) {
			continue;
		}

		units.push({
			type: groundUnit.type,
			name: `${groundUnit.name}/${groundUnit.id}`,
		});
	}

	if (units.length === 0) {
		return;
	}

	if (groundGroup.queries.includes("groundGroups-on target")) {
		target = getEntity<Types.Serialization.ObjectiveSerialized>(groundGroup.targetId);
	}

	return {
		countryName: getCountryForCoalition(groundGroup.coalition, campaign),
		name: groundGroupName(groundGroup),
		position: groundGroup.position,
		units,
		objectiveName: target?.name ?? undefined,
	};
}

export function mapSamGroup(
	entity: Types.Serialization.SAMSerialized,
	campaign: Types.Serialization.UIStateEntitiesArray,
	getEntity: <Entity extends Types.Serialization.EntitySerialized>(id: Types.Campaign.Id) => Entity,
): DcsJs.InputTypes.SamGroup | undefined {
	const units = [];
	let target: Types.Serialization.ObjectiveSerialized | undefined = undefined;

	for (const id of entity.unitIds) {
		const groundUnit = getEntity<Types.Serialization.GroundUnitSerialized>(id);

		if (groundUnit == null) {
			continue;
		}

		if (groundUnit.alive === false) {
			continue;
		}

		units.push({
			type: groundUnit.type,
			name: `${groundUnit.name}/${groundUnit.id}`,
		});
	}

	if (units.length === 0) {
		return;
	}

	target = getEntity<Types.Serialization.ObjectiveSerialized>(entity.objectiveId);

	return {
		countryName: getCountryForCoalition(entity.coalition, campaign),
		name: entity.name,
		units,
		objectiveName: target?.name ?? undefined,
		position: entity.position,
	};
}

export function mapStructure(
	structure:
		| Types.Serialization.FarpSerialized
		| Types.Serialization.UnitCampSerialized
		| Types.Serialization.GenericStructureSerialized,
	campaign: Types.Serialization.UIStateEntitiesArray,
	getEntity: <Entity extends Types.Serialization.EntitySerialized>(id: Types.Campaign.Id) => Entity,
): DcsJs.InputTypes.StaticGroup | undefined {
	const units = [];

	for (const id of structure.buildingIds) {
		const building = getEntity<Types.Serialization.BuildingSerialized>(id);

		if (building == null) {
			continue;
		}

		if (building.alive === false) {
			continue;
		}

		units.push({
			type: building.buildingType,
			name: `${building.buildingType}/${building.id}`,
			position: {
				x: structure.position.x + building.offset.x,
				y: structure.position.y + building.offset.y,
			},
		});
	}

	if (units.length === 0) {
		return undefined;
	}

	return {
		countryName: getCountryForCoalition(structure.coalition, campaign),
		name: structure.name,
		position: structure.position,
		units,
	};
}

export function mapFlightGroup(
	fg: Types.Serialization.FlightGroupSerialized,
	campaign: Types.Serialization.UIStateEntitiesArray,
	getEntity: <Entity extends Types.Serialization.EntitySerialized>(id: Types.Campaign.Id) => Entity,
): DcsJs.InputTypes.FlightGroup | undefined {
	const pkg = getEntity<Types.Serialization.PackageSerialized>(fg.packageId);
	const flightplan = getEntity<Types.Serialization.FlightplanSerialized>(fg.flightplanId);
	const homeBase = getEntity<Types.Serialization.HomeBaseSerialized>(fg.homeBaseId);

	const units: DcsJs.InputTypes.FlightGroupUnit[] = [];
	const waypoints: DcsJs.InputTypes.Waypoint[] = [];

	for (const id of fg.aircraftIds) {
		const unit = getEntity<Types.Serialization.AircraftSerialized>(id);

		if (unit == null) {
			continue;
		}

		if (unit.alive === false) {
			continue;
		}

		if (unit.name == null || unit.callSign == null || unit.loadout == null) {
			throw new Error("Unit name, callsign or loadout is null");
		}

		units.push({
			type: unit.aircraftType,
			name: unit.name ?? unit.id,
			onboardNumber: unit.onboardNumber,
			callsign: unit.callSign,
			isClient: unit.isClient,
			pylons: unit.loadout.pylons,
		});
	}

	for (const wp of flightplan.waypoints) {
		waypoints.push({
			arrivalTime: wp.arrivalTime,
			name: wp.name,
			onGround: wp.onGround,
			position: wp.position,
			type: wp.type,
			duration: wp.duration,
		});

		if (wp.raceTrack != null) {
			waypoints.push({
				arrivalTime: wp.raceTrack.arrivalTime,
				name: wp.raceTrack.name,
				onGround: wp.onGround,
				position: wp.raceTrack.position,
				type: "RaceTrack End",
			});
		}
	}

	return {
		countryName: getCountryForCoalition(fg.coalition, campaign),
		coalition: fg.coalition,
		name: fg.name,
		position: fg.position,
		units,
		frequency: pkg.frequency,
		cruiseSpeed: pkg.cruiseSpeed,
		task: fg.task,
		waypoints,
		startTime: fg.startTime,
		homeBaseName: homeBase.name,
		homeBaseType: homeBase.type,
		hasClients: fg.hasClients,
	};
}
