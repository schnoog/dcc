import * as Utils from "@kilcekru/dcc-shared-utils";

import { GenericWaypointTemplate } from "./Generic";
import { WaypointTemplate, WaypointTemplateProps } from "./Template";

export type HoldWaypointTemplateProps = Pick<WaypointTemplateProps, "position"> & { duration?: number };

export class HoldWaypointTemplate extends WaypointTemplate {
	constructor(args: HoldWaypointTemplateProps) {
		super({
			name: "Hold",
			onGround: false,
			position: args.position,
			duration: args.duration ?? Utils.Config.defaults.holdWaypointDuration,
			type: "Hold",
		});
	}

	public toEscortWaypoint() {
		return new GenericWaypointTemplate({
			name: "Escort",
			onGround: false,
			position: this.position,
			type: "Task",
		});
	}

	public static create(args: HoldWaypointTemplateProps) {
		return new HoldWaypointTemplate(args);
	}

	public createOffsetWaypoint(args: { offset: number }) {
		const offsetWaypoint = new HoldWaypointTemplate({
			...this.serialize(),
			duration: (this.duration ?? 0) + args.offset,
		});

		return offsetWaypoint;
	}
}
