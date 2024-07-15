import * as DcsJs from "@foxdelta2/dcsjs";
import * as Types from "@kilcekru/dcc-shared-types";

import { mapFlightGroup, mapGroundGroup, mapSamGroup, mapStructure } from "./dcsJsMapper";

export function createFlightGroup(
	entity: Types.Serialization.FlightGroupSerialized,
	campaign: Types.Serialization.UIStateEntitiesArray,
	getEntity: <Entity extends Types.Serialization.EntitySerialized>(id: Types.Campaign.Id) => Entity,
): DcsJs.InputTypes.FlightGroup | undefined {
	const entityProps = mapFlightGroup(entity, campaign, getEntity);

	if (entityProps == null) {
		return;
	}

	if (Types.Serialization.isCasFlightGroup(entity)) {
		const targetEntity = getEntity<Types.Serialization.GroundGroupSerialized>(entity.targetGroundGroupId);
		const target = mapGroundGroup(targetEntity, campaign, getEntity);
		if (target == null) {
			return;
		}
		const props: DcsJs.InputTypes.CasFlightGroup = {
			...entityProps,
			task: "CAS",
			target: target,
			jtacFrequency: entity.jtacFrequency,
		};
		return props;
	} else if (Types.Serialization.isStrikeFlightGroup(entity)) {
		const targetEntity = getEntity<Types.Serialization.GenericStructureSerialized>(entity.targetStructureId);
		const target = mapStructure(targetEntity, campaign, getEntity);
		if (target == null) {
			return;
		}
		const props: DcsJs.InputTypes.StrikeFlightGroup = {
			...entityProps,
			task: "Pinpoint Strike",
			target,
		};
		return props;
	} else if (Types.Serialization.isEscortFlightGroup(entity)) {
		const targetEntity = getEntity<Types.Serialization.FlightGroupSerialized>(entity.targetFlightGroupId);
		const target = mapFlightGroup(targetEntity, campaign, getEntity);
		if (target == null) {
			return;
		}
		const props: DcsJs.InputTypes.EscortFlightGroup = {
			...entityProps,
			task: "Escort",
			target: target,
		};
		return props;
	} else if (Types.Serialization.isCapFlightGroup(entity)) {
		const props: DcsJs.InputTypes.CapFlightGroup = {
			...entityProps,
			task: "CAP",
			target: entity.targetPosition,
		};
		return props;
	} else if (Types.Serialization.isDeadFlightGroup(entity)) {
		const targetEntity = getEntity<Types.Serialization.SAMSerialized>(entity.targetSAMId);
		const target = mapSamGroup(targetEntity, campaign, getEntity);
		if (target == null) {
			return;
		}
		const props: DcsJs.InputTypes.DeadFlightGroup = {
			...entityProps,
			task: "DEAD",
			target: target,
		};
		return props;
	} else if (Types.Serialization.isSeadFlightGroup(entity)) {
		const targetEntity = getEntity<Types.Serialization.FlightGroupSerialized>(entity.targetFlightGroupId);
		const target = mapFlightGroup(targetEntity, campaign, getEntity);
		if (target == null) {
			return;
		}
		const props: DcsJs.InputTypes.SeadFlightGroup = {
			...entityProps,
			task: "SEAD",
			target: target,
		};
		return props;
	} else {
		// eslint-disable-next-line no-console
		console.warn("create default flight group", entityProps.task);
		return entityProps;
	}
}
