import * as Data from "../data";
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
export class Country {
	readonly id: number;
	readonly name: Data.CountryName;
	#groundGroups: GroundGroup[] = [];
	#staticGroups: StaticGroup[] = [];
	#samGroups: SamGroup[] = [];
	#plane: FlightGroup[] = [];
	#helicopter: FlightGroup[] = [];

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

		const fg = new FlightGroup({
			coalition,
			frequency: 251,
			groupId: mission.nextGroupId,
			units: [
				{
					name: "AWACS",
					type: aircraftType,
					unitId: mission.nextUnitId,
					callsign: "Magic",
					isClient: false,
					onboardNumber: 1,
					pylons: [],
				},
			],
			isHelicopter: false,
			countryName: this.name,
			cruiseSpeed: 200,
			hasClients: false,
			name: `AWACS-${coalition}`,
			position: {
				x: airdrome.airdromeDefinition.x,
				y: airdrome.airdromeDefinition.y,
			},
			task: "AWACS",
			homeBaseName: airdrome.airdromeDefinition.name,
			homeBaseType: "Airdrome",
			startTime: 0,
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
					name: `AWACS-${coalition}-1`,
					onGround: false,
					position: {
						x: airdrome.airdromeDefinition.x,
						y: airdrome.airdromeDefinition.y,
					},
					type: "Task",
					duration: 3600000,
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
