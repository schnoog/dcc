import * as DcsJs from "@foxdelta2/dcsjs";
import * as Types from "@kilcekru/dcc-shared-types";
import * as Utils from "@kilcekru/dcc-shared-utils";

import { Position } from "../components";
import { world } from "../world";
import { Flightplan } from "./Flightplan";
import { HomeBase } from "./HomeBase";

export enum WaypointType {
	TakeOff,
	Landing,
	Task,
	Nav,
}

export interface WaypointTemplateProps extends Position {
	name: string;
	onGround: boolean;
	duration?: number;
	type: WaypointType;
	raceTrack?: {
		name: string;
		position: DcsJs.Position;
	};
}

export class WaypointTemplate implements Position {
	public name: string;
	public position: DcsJs.Position;
	public onGround: boolean;
	public duration: number | undefined;
	public type: WaypointType;
	public racetrack:
		| {
				name: string;
				position: DcsJs.Position;
		  }
		| undefined;

	constructor(args: WaypointTemplateProps) {
		this.name = args.name;
		this.position = args.position;
		this.onGround = args.onGround;
		this.duration = args.duration;
		this.type = args.type;
		this.racetrack = args.raceTrack;
	}

	static takeOffWaypoint(homeBase: HomeBase) {
		return new TakeoffWaypoint({
			position: homeBase.position,
		});
	}

	static raceTrackWaypoint(args: {
		positions: {
			from: DcsJs.Position;
			to: DcsJs.Position;
		};
		duration: number;
		type: WaypointType;
	}) {
		return new RaceTrackWaypoint({
			duration: args.duration,
			position: args.positions.from,
			raceTrackPosition: args.positions.to,
			type: args.type,
		});
	}

	static landingWaypoints(args: { prevWaypoint: WaypointTemplate; homeBase: HomeBase }) {
		const distancePrevWaypoint = Utils.Location.distanceToPosition(args.prevWaypoint.position, args.homeBase.position);
		const landingWaypoint = new LandingWaypoint({
			position: args.homeBase.position,
		});

		if (distancePrevWaypoint < 32000) {
			return [landingWaypoint];
		} else {
			const heading = Utils.Location.headingToPosition(args.prevWaypoint.position, args.homeBase.position);
			const position = Utils.Location.positionFromHeading(
				args.homeBase.position,
				Utils.Location.addHeading(heading, 180),
				32000,
			);

			return [
				new WaypointTemplate({
					name: "Nav",
					position,
					onGround: false,
					type: WaypointType.Nav,
				}),
				landingWaypoint,
			];
		}
	}

	toJSON(): Types.Campaign.WaypointItem {
		return {
			name: this.name,
			position: this.position,
			onGround: this.onGround,
			duration: this.duration,
		};
	}
}

export interface TakeoffWaypointProps {
	position: DcsJs.Position;
}

export class TakeoffWaypoint extends WaypointTemplate {
	constructor(args: TakeoffWaypointProps) {
		super({
			name: "Take Off",
			onGround: true,
			position: args.position,
			duration: Utils.DateTime.Minutes(10),
			type: WaypointType.TakeOff,
		});
	}
}

export class LandingWaypoint extends WaypointTemplate {
	constructor(args: TakeoffWaypointProps) {
		super({
			name: "Landing",
			onGround: true,
			position: args.position,
			type: WaypointType.Landing,
		});
	}
}
export interface RaceTrackWaypointProps extends Omit<WaypointTemplateProps, "onGround" | "name"> {
	duration: number;
	raceTrackPosition: DcsJs.Position;
}

export class RaceTrackWaypoint extends WaypointTemplate {
	constructor(args: RaceTrackWaypointProps) {
		super({
			...args,
			onGround: false,
			name: "Racetrack Start",
			duration: args.duration,
			raceTrack: {
				name: "Racetrack End",
				position: args.raceTrackPosition,
			},
		});
	}
}

export interface WaypointProps extends WaypointTemplateProps {
	arrivalDuration: number;
	flightplan: Flightplan;
}

export class Waypoint extends WaypointTemplate {
	arrivalDuration: number;
	#flightplan: Flightplan;

	constructor(args: WaypointProps) {
		super(args);
		this.#flightplan = args.flightplan;
		this.arrivalDuration = args.arrivalDuration;
	}

	get isRacetrack() {
		return this.racetrack != null;
	}

	get arrivalTime() {
		let arrivalTime = this.#flightplan.startTime;

		for (const wp of this.#flightplan.waypoints) {
			arrivalTime += wp.arrivalDuration;

			if (wp === this) {
				break;
			}

			arrivalTime += wp.duration ?? 0;
		}

		return arrivalTime;
	}

	get departureTime() {
		return this.arrivalTime + (this.duration ?? 0);
	}

	get isActive() {
		return world.time >= this.arrivalTime && world.time <= this.departureTime;
	}
}
