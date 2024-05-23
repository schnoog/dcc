import type * as DcsJs from "@foxdelta2/dcsjs";
import type * as Types from "@kilcekru/dcc-shared-types";
import * as Utils from "@kilcekru/dcc-shared-utils";

import { Events, Serialization } from "../../../utils";
import { GenericWaypointTemplate, WaypointTemplate } from "../../objects";
import { getEntity, store } from "../../store";
import { EscortedFlightGroupProps, FlightGroup, Structure } from "../_base";
import { DownedPilot } from "../DownedPilot";

interface CsarFlightGroupProps extends Omit<EscortedFlightGroupProps, "entityType" | "task"> {
	targetDownedPilotId: Types.Campaign.Id;
	pilotOnBoard: boolean;
}

interface CreateCsarFlightGroupProps extends Omit<CsarFlightGroupProps, "task" | "taskWaypoints" | "pilotOnBoard"> {}

export class CsarFlightGroup extends FlightGroup<keyof Events.EventMap.CsarFlightGroup> {
	readonly #targetDownedPilotId: Types.Campaign.Id;
	#pilotOnBoard = false;

	private constructor(args: CsarFlightGroupProps | Types.Serialization.CsarFlightGroupSerialized) {
		const superArgs = Serialization.isSerialized(args)
			? args
			: { ...args, task: "CSAR" as const, entityType: "CsarFlightGroup" as const };
		super(superArgs);
		this.#targetDownedPilotId = args.targetDownedPilotId;
		this.#pilotOnBoard = args.pilotOnBoard;
	}

	static create(args: CreateCsarFlightGroupProps) {
		const pilot = getEntity<Structure>(args.targetDownedPilotId);

		const duration = Utils.DateTime.Minutes(30);

		const waypoints: Array<WaypointTemplate> = [
			GenericWaypointTemplate.create({
				position: pilot.position,
				duration,
				type: "Task",
				name: "Pick Up Pilot",
			}),
		];

		return new CsarFlightGroup({
			...args,
			targetDownedPilotId: pilot.id,
			taskWaypoints: waypoints,
			pilotOnBoard: false,
		});
	}

	/**
	 * Check if the downed pilot is already targeted by a CSAR flight group
	 * @param coalition - the coalition of the CSAR flight group
	 * @param structure - the structure to check
	 * @returns true if the downed is already targeted by a CSAR flight group
	 */
	static #downedPilotAlreadyTargeted(args: { coalition: DcsJs.Coalition; pilot: DownedPilot }) {
		const coalitionStrikeFgs = store.queries.flightGroups[args.coalition].get("Pinpoint Strike");

		for (const fg of coalitionStrikeFgs) {
			if (fg instanceof CsarFlightGroup && fg.#targetDownedPilotId === args.pilot.id) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Get a possible target structure for a Pinpoint Strike flight group
	 * @param coalition - the coalition of the Strike flight group
	 * @param homeBase - the home base of the Strike flight group
	 * @returns the possible target structure
	 **/
	static #getTargetPilot(args: Pick<CsarFlightGroup, "coalition" | "homeBase">) {
		const downedPilots = store.queries.downedPilots[args.coalition];
		const oppCoalition = Utils.Coalition.opposite(args.coalition);
		const oppGroundUnits = store.queries.groundGroups[oppCoalition];
		let distanceToHomeBase = 99999999;
		let targetDownedPilot: DownedPilot | undefined;

		for (const downedPilot of downedPilots) {
			// Is the structure already targeted by a Strike flight group?
			if (this.#downedPilotAlreadyTargeted({ coalition: args.coalition, pilot: downedPilot })) {
				continue;
			}

			const distance = Utils.Location.distanceToPosition(args.homeBase.position, downedPilot.position);

			if (distance > Utils.Config.packages["Pinpoint Strike"].maxDistance) {
				continue;
			}

			const nearestFrontline = Utils.Location.findNearest(oppGroundUnits, downedPilot.position, (str) => str.position);

			if (nearestFrontline == null) {
				if (distance < distanceToHomeBase) {
					targetDownedPilot = downedPilot;
					distanceToHomeBase = distance;
				}

				continue;
			}

			const distanceToFrontline = Utils.Location.distanceToPosition(downedPilot.position, nearestFrontline.position);

			if (distanceToFrontline < distanceToHomeBase) {
				targetDownedPilot = downedPilot;
				distanceToHomeBase = distance;
			}
		}

		if (targetDownedPilot == null) {
			// eslint-disable-next-line no-console
			console.warn("no ground group target found for cas package", this);

			return;
		}

		return targetDownedPilot;
	}

	/**
	 *
	 * @param args
	 * @returns
	 */
	static getValidTarget(args: Pick<CsarFlightGroupProps, "coalition" | "homeBase">) {
		const targetStructure = this.#getTargetPilot(args);

		if (targetStructure == null) {
			return undefined;
		}

		return targetStructure;
	}

	static deserialize(args: Types.Serialization.CsarFlightGroupSerialized) {
		return new CsarFlightGroup(args);
	}

	public override serialize(): Types.Serialization.CsarFlightGroupSerialized {
		return {
			...super.serialize(),
			entityType: "CasFlightGroup",
			targetDownedPilotId: this.#targetDownedPilotId,
			pilotOnBoard: this.#pilotOnBoard,
		};
	}
}
