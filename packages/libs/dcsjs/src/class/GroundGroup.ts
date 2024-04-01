import * as Data from "../data";
import { randomItem, randomPosition } from "../utils";
import { Group, GroupProps } from "./Group";
import type { Mission } from "./Mission";

export interface GroundGroupUnit {
	name: string;
	unitId: number;
	type: Data.GroundUnitType;
}
export interface GroundGroupProps extends GroupProps {
	units: GroundGroupUnit[];
	objectiveName?: string;
}

export class GroundGroup extends Group {
	readonly units: GroundGroupUnit[];
	readonly objectiveName: string | undefined;

	constructor(args: GroundGroupProps) {
		super(args);
		this.units = args.units;
		this.objectiveName = args.objectiveName;
	}

	public override toGenerated(mission: Mission): Data.GeneratedTypes.GroundGroup {
		let target: Data.Target | undefined = undefined;
		if (this.objectiveName != null) {
			const targets = Data.Theatres[mission.theatre].targets[this.objectiveName];

			if (targets == null) {
				throw new Error(`targets ${this.objectiveName} not found`);
			}

			target = randomItem(targets, (t) => t.type === "Vehicle");
		}

		const groupPosition = target == null ? this.position : target.position;

		const units: Data.GeneratedTypes.GroundUnit[] = this.units.map((unit, i) => {
			let position: Data.Position | undefined = target == null ? undefined : target.unitPositions[i];

			if (position == null) {
				position = randomPosition(this.position, 100);
			}

			return {
				coldAtStart: false,
				heading: 0,
				name: unit.name,
				skill: mission.aiSkill,
				type: unit.type,
				x: position.x,
				y: position.y,
				unitId: unit.unitId,
			};
		});

		return {
			...super.toGenerated(mission),
			name: this.name,
			groupId: this.groupId,
			units,
			visible: false,
			tasks: [],
			uncontrollable: false,
			task: "Ground Nothing",
			taskSelected: true,
			route: {
				points: [
					{
						action: "Off Road",
						alt: 0,
						alt_type: "RADIO",
						ETA: 0,
						ETA_locked: true,
						name: "",
						speed: 0,
						task: {
							id: "ComboTask",
							params: {
								tasks: [],
							},
						},
						type: "Turning Point",
						x: groupPosition.x,
						y: groupPosition.y,
						speed_locked: true,
					},
				],
			},
			hidden: false,
			x: groupPosition.x,
			y: groupPosition.y,
			start_time: 0,
		};
	}
}
