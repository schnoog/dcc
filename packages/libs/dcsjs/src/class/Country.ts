import * as Data from "../data";
import { oppositionCoalition } from "../utils";
import { Airdrome } from "./Airdrome";
import { FlightGroup, FlightGroupUnit } from "./FlightGroup";
import { GroundGroup, GroundGroupUnit } from "./GroundGroup";
import type { Mission } from "./Mission";
import { SamGroup } from "./SamGroup";
import { StaticGroup } from "./StaticGroup";

interface CountryProps {
	id: number;
	name: Data.CountryName;
}

const headingToPosition = (position1: Data.Position, position2: Data.Position) => {
	return Math.round((Math.atan2(position2.y - position1.y, position2.x - position1.x) * 180) / Math.PI);
};

const isPosition = (value: Data.Position | { position: Data.Position }): value is Data.Position => {
	return (value as Data.Position).x != null;
};

const objectToPosition = <T extends Data.Position | { position: Data.Position }>(value: T): Data.Position => {
	if (isPosition(value)) {
		return {
			x: value.x,
			y: value.y,
		};
	} else {
		return value.position;
	}
};

const addHeading = (heading: number, value: number) => {
	let sum = heading + value;

	while (sum < 0) {
		sum += 360;
	}

	return sum % 360;
};

const degreesToRadians = (degrees: number) => {
	// return parseFloat(((degrees * Math.PI) / 180).toFixed(2));
	return (degrees / 360) * 2 * Math.PI;
};

const positionFromHeading = (pos: Data.Position, heading: number, distance: number): Data.Position => {
	let positiveHeading = heading;
	while (positiveHeading < 0) {
		positiveHeading += 360;
	}

	positiveHeading %= 360;

	const radHeading = degreesToRadians(positiveHeading);

	return {
		x: pos.x + Math.cos(radHeading) * distance,
		y: pos.y + Math.sin(radHeading) * distance,
	};
};

export class Country {
	readonly id: number;
	readonly name: Data.CountryName;
	#groundGroups: GroundGroup[] = [];
	#staticGroups: StaticGroup[] = [];
	#samGroups: SamGroup[] = [];
	#plane: FlightGroup[] = [];
	#helicopter: FlightGroup[] = [];

	get staticGroups() {
		return this.#staticGroups;
	}

	get flightGroups() {
		return [...this.#plane, ...this.#helicopter];
	}

	constructor(args: CountryProps) {
		this.id = args.id;
		this.name = args.name;
	}

	public createGroundGroup(args: Data.InputTypes.GroundGroup, mission: Mission) {
		const id = mission.nextGroupId;

		const units: GroundGroupUnit[] = [];

		for (const unit of args.units) {
			const unitId = mission.nextUnitId;

			units.push({
				name: unit.name,
				type: unit.type,
				unitId,
			});
		}

		const gg = new GroundGroup({
			...args,
			groupId: id,
			units,
		});

		this.#groundGroups.push(gg);
	}

	public createSamGroup(args: Data.InputTypes.SamGroup, mission: Mission) {
		const id = mission.nextGroupId;
		const units: GroundGroupUnit[] = [];

		for (const unit of args.units) {
			const unitId = mission.nextUnitId;

			units.push({
				name: unit.name,
				type: unit.type,
				unitId,
			});
		}

		const sg = new SamGroup({
			...args,
			groupId: id,
			units,
		});

		this.#samGroups.push(sg);
	}

	public createStaticGroup(args: Data.InputTypes.StaticGroup, mission: Mission) {
		for (const building of args.units) {
			const id = mission.nextGroupId;
			const unitId = mission.nextUnitId;

			const sg = new StaticGroup({
				...args,
				position: building.position,
				groupId: id,
				unitId,
				buildingName: building.name,
				buildingType: building.type,
			});

			this.#staticGroups.push(sg);
		}
	}

	public createFlightGroup(args: Data.InputTypes.FlightGroup, mission: Mission) {
		const id = mission.nextGroupId;
		let isHelicopter = false;
		const units: FlightGroupUnit[] = [];

		for (const unit of args.units) {
			const unitId = mission.nextUnitId;
			const aircraftData = Data.aircraftDefinitions[unit.type];

			if (aircraftData.isHelicopter === true) {
				isHelicopter = true;
			}

			units.push({
				...unit,
				unitId,
			});
		}

		const fg = new FlightGroup({
			...args,
			groupId: id,
			units,
			isHelicopter,
		});

		if (isHelicopter === true) {
			this.#helicopter.push(fg);
		} else {
			this.#plane.push(fg);
		}
	}

	public generateAWACS(coalition: Data.Coalition, aircraftType: Data.AircraftType, mission: Mission) {
		let airdrome: Airdrome | undefined = undefined;
		for (const ad of mission.airdromes[coalition]?.values() ?? []) {
			airdrome = ad;
			break;
		}

		if (airdrome === undefined) {
			throw new Error("No airdrome found");
		}

		const oppCoalition = oppositionCoalition(coalition);

		let oppAirdrome: Airdrome | undefined = undefined;
		for (const ad of mission.airdromes[oppCoalition]?.values() ?? []) {
			oppAirdrome = ad;
			break;
		}

		if (oppAirdrome === undefined) {
			throw new Error("No opp airdrome found");
		}

		const headingToOppAirdrome = headingToPosition(
			objectToPosition(airdrome.airdromeDefinition),
			objectToPosition(oppAirdrome.airdromeDefinition),
		);

		const awacsHeading = addHeading(headingToOppAirdrome, 180);

		const startPosition = positionFromHeading(objectToPosition(airdrome.airdromeDefinition), awacsHeading, 20000);

		const endPosition = positionFromHeading(objectToPosition(airdrome.airdromeDefinition), awacsHeading, 40000);

		const fg = new FlightGroup({
			coalition,
			frequency: 251,
			groupId: mission.nextGroupId,
			units: [
				{
					name: "AWACS",
					type: aircraftType,
					unitId: mission.nextUnitId,
					callsign: {
						name: "Magic",
						"1": 1,
						"2": 1,
						"3": 1,
					},
					isClient: false,
					onboardNumber: 111,
					pylons: [],
					heading: awacsHeading,
				},
			],
			isHelicopter: false,
			countryName: this.name,
			cruiseSpeed: 389,
			hasClients: false,
			name: `AWACS-${coalition}`,
			position: startPosition,
			task: "AWACS",
			homeBaseName: airdrome.airdromeDefinition.name,
			homeBaseType: "Airdrome",
			startTime: mission.time - 10000,
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
					name: "Race-Track Start",
					onGround: false,
					position: startPosition,
					type: "Task",
					duration: 3700000,
				},
				{
					arrivalTime: mission.time - 1000,
					name: "Race-Track End",
					onGround: false,
					position: endPosition,
					type: "RaceTrack End",
				},
			],
		});

		this.#plane.push(fg);
	}

	public toGenerated(mission: Mission): Data.GeneratedTypes.Country {
		return {
			id: this.id,
			name: this.name,
			plane: {
				group: this.#plane.map((fg) => fg.toGenerated(mission)),
			},
			helicopter: {
				group: this.#helicopter.map((fg) => fg.toGenerated(mission)),
			},
			vehicle: {
				group: [
					...this.#groundGroups.map((gg) => gg.toGenerated(mission)),
					...this.#samGroups.map((sg) => sg.toGenerated(mission)),
				],
			},
			static: {
				group: this.#staticGroups.map((sg) => sg.toGenerated(mission)),
			},
		};
	}
}
