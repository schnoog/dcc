import * as z from "zod";

import { Mission } from "../class/Mission";
import { GeneratedTypes, InputTypes } from "../data";

const defaultMissionParams: InputTypes.Mission = {
	date: new Date(),
	id: "test",
	time: 32400000,
	theatre: "Caucasus",
	weather: {
		cloudCover: 0,
		cloudCoverData: [],
		offset: 0,
		temperature: 0,
		wind: {
			direction: 0,
			speed: 0,
		},
	},
	aiSkill: "Average",
	airdromes: {
		blue: new Set("Kobuleti"),
		red: new Set("Gudauta"),
		neutrals: new Set(),
	},
	countries: {
		blue: "USA",
		red: "Russia",
		neutrals: "Georgia",
	},
};

describe("Mission", () => {
	it("init params", () => {
		const mission = new Mission(defaultMissionParams);

		const generated = mission.toGenerated();

		expect(generated).toMatchSnapshot();
	});
	it("ground group", () => {
		const mission = new Mission(defaultMissionParams);

		mission.createGroundGroup({
			name: "Test Group",
			countryName: "USA",
			position: {
				x: -298594.0361111,
				y: 637215.60223479,
			},
			units: [
				{
					name: "Test Unit",
					type: "Infantry AK",
				},
			],
		});

		const generated = mission.toGenerated();

		expect(generated).toMatchSnapshot();
	});
	it("static group", () => {
		const mission = new Mission(defaultMissionParams);

		mission.createStaticGroup({
			name: "Test Static Group",
			countryName: "USA",
			position: {
				x: -298294.0361111,
				y: 637215.60223479,
			},
			units: [
				{
					name: "Test Static Unit",
					type: ".Command Center",
					position: {
						x: -298294.0361111,
						y: 637215.60223479,
					},
				},
			],
		});

		const generated = mission.toGenerated();

		expect(generated).toMatchSnapshot();
	});
	it("flight group", () => {
		const mission = new Mission(defaultMissionParams);

		mission.createFlightGroup({
			countryName: "USA",
			name: "Test Flight Group",
			position: {
				x: -298294.0361111,
				y: 637215.60223479,
			},
			startTime: 32400000,
			homeBaseName: "Kobuleti",
			homeBaseType: "Airdrome",
			coalition: "blue",
			hasClients: false,
			units: [
				{
					name: "Test Client",
					type: "A-10C",
					callsign: {
						1: 10,
						2: 1,
						3: 1,
						name: "Boar11",
					},
					isClient: false,
					onboardNumber: 1,
					pylons: [],
				},
				{
					name: "Test Flight Unit",
					type: "A-10C",
					onboardNumber: 2,
					callsign: {
						1: 10,
						2: 1,
						3: 2,
						name: "Boar12",
					},
					isClient: false,
					pylons: [],
				},
			],
			task: "CAS",
			frequency: 124,
			cruiseSpeed: 150,
			waypoints: [
				{
					name: "First",
					onGround: false,
					position: {
						x: -298294.0361111,
						y: 637215.60223479,
					},
					arrivalTime: 32120000,
					type: "TakeOff",
				},
				{
					name: "Second",
					onGround: false,
					position: {
						x: -295294.0361111,
						y: 637115.60223479,
					},
					arrivalTime: 32400000,
					type: "Task",
				},
			],
		});

		const generated = mission.toGenerated();

		expect(generated.coalition.blue?.country).toBeDefined();

		const countries = z.array(GeneratedTypes.Schema.country).parse(generated.coalition.blue?.country);
		const usa = countries?.find((country: GeneratedTypes.Country) => country.name === "USA");

		expect(usa).toBeDefined();

		const groups = z.array(GeneratedTypes.Schema.flightGroup).parse(usa?.plane?.group);

		expect(groups).toHaveLength(1);
	});
	it("client flight group", () => {
		const mission = new Mission(defaultMissionParams);

		mission.createFlightGroup({
			countryName: "USA",
			name: "Test Flight Group",
			position: {
				x: -298294.0361111,
				y: 637215.60223479,
			},
			startTime: 32400000,
			homeBaseName: "Kobuleti",
			homeBaseType: "Airdrome",
			coalition: "blue",
			hasClients: true,
			units: [
				{
					name: "Test Client",
					type: "A-10C",
					callsign: {
						1: 10,
						2: 1,
						3: 1,
						name: "Boar11",
					},
					isClient: true,
					onboardNumber: 3,
					pylons: [],
				},
				{
					name: "Test Flight Unit",
					type: "A-10C",
					callsign: {
						1: 10,
						2: 1,
						3: 2,
						name: "Boar12",
					},
					isClient: false,
					onboardNumber: 4,
					pylons: [],
				},
			],
			task: "CAS",
			frequency: 124,
			cruiseSpeed: 150,
			waypoints: [
				{
					name: "First",
					onGround: false,
					position: {
						x: -298294.0361111,
						y: 637215.60223479,
					},
					arrivalTime: 32120000,
					type: "TakeOff",
				},
				{
					name: "Second",
					onGround: false,
					position: {
						x: -295294.0361111,
						y: 637115.60223479,
					},
					arrivalTime: 32150000,
					type: "Task",
				},
			],
		});

		const generated = mission.toGenerated();

		expect(generated.coalition.blue?.country).toBeDefined();

		const countries = z.array(GeneratedTypes.Schema.country).parse(generated.coalition.blue?.country);
		const usa = countries?.find((country: GeneratedTypes.Country) => country.name === "USA");

		expect(usa).toBeDefined();

		const groups = z.array(GeneratedTypes.Schema.flightGroup).parse(usa?.plane?.group);

		expect(groups).toHaveLength(1);

		const [group] = groups;

		expect(group?.units).toHaveLength(2);

		const unit = group?.units[0];

		expect(unit).toBeDefined();

		expect(unit?.skill).toBe("Client");
	});
	it("lua table", () => {
		const mission = new Mission(defaultMissionParams);

		const table = mission.toMissionLuaTable();

		expect(table).toMatchSnapshot();
	});
	it("warehouse", () => {
		const mission = new Mission(defaultMissionParams);

		const table = mission.toWarehouseLuaTable();

		expect(table).toMatchSnapshot();
	});
});
