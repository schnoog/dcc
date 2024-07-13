import * as Data from "../data";
import { callSign, random } from "../utils";
import { Airdrome } from "./Airdrome";
import { CasFlightGroup } from "./CasFlightGroup";
import { FlightGroupProps } from "./FlightGroup";
import { Mission } from "./Mission";

export type JtacFlightGroupProps = Pick<FlightGroupProps, "coalition" | "countryName" | "position"> & {
	jtacFrequency: number;
	targetId: string;
	targetName: string;
	targetPosition: Data.Position;
};

export class JtacFlightGroup extends CasFlightGroup {
	constructor(args: Data.InputTypes.CasFlightGroup, mission: Mission) {
		let airdrome: Airdrome | undefined = undefined;
		for (const ad of mission.airdromes[args.coalition]?.values() ?? []) {
			airdrome = ad;
			break;
		}

		if (airdrome === undefined) {
			throw new Error("No airdrome found");
		}

		const aircraftType = "RQ-1A Predator";

		const { name, index } = callSign(aircraftType, "aircraft");

		const jtacId = mission.nextJTACId;

		super({
			...args,
			groupId: mission.nextGroupId,
			task: "AFAC",
			units: [
				{
					type: aircraftType,
					callsign: {
						"1": 6,
						"2": jtacId,
						"3": index + 1,
						name: `${name}${jtacId}${index + 1}`,
					},
					name: `JTAC ${args.target.name}`,
					isClient: false,
					onboardNumber: random(1, 50),
					pylons: [],
					unitId: mission.nextUnitId,
				},
			],
			waypoints: [
				{
					arrivalTime: mission.time - 10000,
					name: "Take Off",
					onGround: true,
					position: {
						x: airdrome.airdromeDefinition.x,
						y: airdrome.airdromeDefinition.y,
					},
					type: "TakeOff",
					duration: 0,
				},
				{
					arrivalTime: mission.time - 1000,
					name: "AFAC",
					onGround: true,
					position: args.target.position,
					type: "Task",
					duration: 3700000,
				},
			],
			cruiseSpeed: 200,
			isHelicopter: false,
			name: `JTAC ${args.target.name}`,
			position: args.target.position,
			frequency: args.jtacFrequency,
			startTime: mission.time - 10000,
			homeBaseName: airdrome.airdromeDefinition.name,
			homeBaseType: "Airdrome",
			hasClients: false,
			target: args.target,
		});
	}
}
