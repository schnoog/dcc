import { Mission } from "../class";
import { save } from "../save";

async function saveMission() {
	// eslint-disable-next-line no-console
	console.log("🍵 start");

	const mission = new Mission({
		id: "test",
		date: new Date(),
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
	});

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

	mission.createFlightGroup({
		countryName: "USA",
		name: "Test Flight Group",
		homeBaseName: "Kobuleti",
		homeBaseType: "Airdrome",
		coalition: "blue",
		hasClients: true,
		position: {
			x: -298294.0361111,
			y: 637215.60223479,
		},
		units: [
			{
				name: "Test Client",
				type: "A-10C",
				onboardNumber: 1,
				callsign: {
					1: 10,
					2: 1,
					3: 1,
					name: "Boar11",
				},
				isClient: true,
				pylons: [],
			},
			{
				name: "Test Flight Unit",
				onboardNumber: 2,
				type: "A-10C",
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
		startTime: 32120000,
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

	const path = "./dist/test.miz";

	await save(mission, path);

	// eslint-disable-next-line no-console
	console.log("👌 done");
}

void saveMission();
