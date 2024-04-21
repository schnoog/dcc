import * as luaTable from "@kilcekru/lua-table";

import * as Data from "../data";
import { msTimeToDcsTime, oppositionCoalition } from "../utils";
import { Airdrome } from "./Airdrome";
import { Country } from "./Country";
import { Trigger } from "./Trigger";
export class Mission {
	#nextGroupId = 1;
	#nextUnitId = 1;
	#nextSTN_L16 = 201;
	#nextVoiceCallsignNumber = 11;
	#nextDatalinkUnitId = 1;
	#id;
	#countries: Map<Data.CountryName, Country> = new Map();
	airdromes: Partial<Record<Data.Coalition, Map<string, Airdrome>>>;
	#factionCountries: Partial<Record<Data.Coalition, Data.CountryName>>;
	#trigger = new Trigger();
	#hotStart: boolean;
	readonly theatre: Data.Theatre;
	readonly weather: Data.Weather;
	readonly date: Date;
	readonly time: number;
	readonly aiSkill: Data.AiSkill;

	public get nextGroupId() {
		return this.#nextGroupId++;
	}

	public get nextUnitId() {
		return this.#nextUnitId++;
	}

	public get nextSTN_L16() {
		return this.#nextSTN_L16++;
	}

	public get nextDatalinkUnitId() {
		return this.#nextDatalinkUnitId++;
	}

	public get hotStart() {
		return this.#hotStart;
	}

	constructor(args: Data.InputTypes.Mission) {
		this.theatre = args.theatre;
		this.time = args.time;
		this.weather = args.weather;
		this.date = args.date;
		this.aiSkill = args.aiSkill;
		this.#factionCountries = args.countries;
		this.#id = args.id;
		this.airdromes = {
			blue: new Map(),
			red: new Map(),
			neutrals: new Map(),
		};
		this.#hotStart = args.hotStart ?? false;

		for (const country of Object.values(Data.countries)) {
			this.#countries.set(country.name, new Country({ ...country }));
		}

		for (const [key, airdromeNames] of Object.entries(args.airdromes)) {
			const coalition = key as Data.Coalition;
			for (const airdromeName of airdromeNames) {
				const airdrome = new Airdrome({
					name: airdromeName,
					theatre: this.theatre,
				});

				this.airdromes[coalition]?.set(airdromeName, airdrome);
			}
		}
	}

	#coalitionCountries(coalition: Data.Coalition) {
		const countries = Data.coalitionCountries[coalition];
		const oppCoalition = oppositionCoalition(coalition);
		const factionCountryName = this.#factionCountries[coalition];
		const oppFactionCountryName = this.#factionCountries[oppCoalition];

		if (factionCountryName == null || oppFactionCountryName == null) {
			throw new Error(`Faction country missing for ${coalition}`);
		}

		// is the faction country missing?
		if (!countries.some((country) => country.name === factionCountryName)) {
			const country = Data.countries[factionCountryName];

			countries.push(country);
		}

		// is the opp faction country in the list?
		if (countries.some((country) => country.name === oppFactionCountryName)) {
			return countries.filter((country) => country.name !== oppFactionCountryName);
		}

		return countries;
	}

	public createGroundGroup(props: Data.InputTypes.GroundGroup) {
		const args = Data.InputTypes.Schema.groundGroup.parse(props);

		this.#countries.get(args.countryName)?.createGroundGroup(args, this);
	}

	public createStaticGroup(props: Data.InputTypes.StaticGroup) {
		const args = Data.InputTypes.Schema.staticGroup.parse(props);

		this.#countries.get(args.countryName)?.createStaticGroup(args, this);
	}

	public createFlightGroup(props: Data.InputTypes.FlightGroup) {
		const args = Data.InputTypes.Schema.flightGroup.parse(props);

		this.#countries.get(args.countryName)?.createFlightGroup(args, this);
	}

	public createSamGroup(props: Data.InputTypes.SamGroup) {
		const args = Data.InputTypes.Schema.samGroup.parse(props);

		this.#countries.get(args.countryName)?.createSamGroup(args, this);
	}

	public generateAWACS(props: Data.InputTypes.GenerateAWACS) {
		for (const entry of Object.entries(this.#factionCountries)) {
			const coalition = entry[0] as Data.Coalition;
			if (coalition === "neutrals") {
				continue;
			}

			const aircraftType = props[coalition];

			if (aircraftType == null) {
				throw new Error(`Aircraft type missing for ${coalition}`);
			}

			this.#countries.get(entry[1])?.generateAWACS(coalition, aircraftType, this);
		}
	}

	public getCountry(coalition: Data.Coalition) {
		const factionCountryName = this.#factionCountries[coalition];

		if (factionCountryName == null) {
			throw new Error(`Faction country missing for ${coalition}`);
		}

		const country = this.#countries.get(factionCountryName);

		if (country == null) {
			throw new Error(`Country ${factionCountryName} not found`);
		}

		return country;
	}

	#coalitionCountriesToGenerated(coalition: Data.Coalition) {
		const generatedCountries: Data.GeneratedTypes.Country[] = [];

		for (const country of this.#coalitionCountries(coalition)) {
			if (country.name === this.#factionCountries[coalition]) {
				const countryClass = this.#countries.get(country.name);

				if (countryClass == null) {
					throw new Error(`Country ${country.name} not found`);
				}

				generatedCountries.push(countryClass.toGenerated(this));
			}
		}

		return generatedCountries;
	}

	#addLuaFiles() {
		this.#trigger.addLoadFile("ResKey_Action_6", "Load Mist");
		this.#trigger.addLoadFile("ResKey_Action_7", "Load Json");
		this.#trigger.addLoadFile("ResKey_Action_8", "Load Config");
		this.#trigger.addLoadFile("ResKey_Action_9", "Load State");
	}

	public toGenerated(): Data.GeneratedTypes.Mission {
		const theatre = Data.Theatres[this.theatre];

		this.#addLuaFiles();

		return {
			coalition: {
				blue: {
					bullseye: {
						x: 0,
						y: 0,
					},
					nav_points: [],
					name: "blue",
					country: this.#coalitionCountriesToGenerated("blue"),
				},
				red: {
					bullseye: {
						x: 0,
						y: 0,
					},
					nav_points: [],
					name: "red",
					country: this.#coalitionCountriesToGenerated("red"),
				},
				neutrals: {
					bullseye: {
						x: 0,
						y: 0,
					},
					nav_points: [],
					name: "neutrals",
					country: this.#coalitionCountriesToGenerated("neutrals"),
				},
			},
			coalitions: {
				blue: this.#coalitionCountries("blue").map((country) => country.id),
				neutrals: [
					70, 83, 23, 65, 86, 64, 25, 63, 76, 90, 29, 62, 30, 78, 87, 31, 61, 32, 33, 60, 17, 35, 69, 36, 59, 71, 79,
					58, 57, 56, 55, 88, 73, 39, 89, 54, 77, 72, 41, 42, 44, 85, 75, 53, 22, 52, 66, 51, 74, 82, 7, 68, 50, 49, 48,
					67,
				],
				red: this.#coalitionCountries("red").map((country) => country.id),
			},
			currentKey: 52,
			date: {
				Day: this.date.getDate(),
				Month: this.date.getMonth() + 1,
				Year: this.date.getFullYear(),
			},
			descriptionBlueTask: "DictKey_descriptionBlueTask_3",
			descriptionRedTask: "DictKey_descriptionRedTask_2",
			descriptionText: "DictKey_descriptionText_1",
			descriptionNeutralsTask: "DictKey_descriptionNeutralsTask_4",
			maxDictId: 5,
			failures: {},
			goals: {},
			pictureFileNameB: [], // ["DCC_Logo_1024.png"],
			pictureFileNameN: [],
			pictureFileNameR: [], //["DCC_Logo_1024.png"],
			start_time: msTimeToDcsTime(this.time),
			theatre: this.theatre,
			triggers: {
				zones: {},
			},
			trig: this.#trigger.generateTrig(),
			trigrules: this.#trigger.triggerRules,
			map: {
				centerX: theatre.info.center.x,
				centerY: theatre.info.center.y,
				zoom: 700000,
			},
			groundControl: {
				passwords: {
					artillery_commander: {},
					forward_observer: {},
					observer: {},
					instructor: {},
				},
				isPilotControlVehicles: false,
				roles: {
					artillery_commander: {
						blue: 0,
						red: 0,
						neutrals: 0,
					},
					forward_observer: {
						blue: 0,
						red: 0,
						neutrals: 0,
					},
					observer: {
						blue: 0,
						red: 0,
						neutrals: 0,
					},
					instructor: {
						blue: 0,
						red: 0,
						neutrals: 0,
					},
				},
			},
			version: 22,
			sortie: "DictKey_sortie_5",
			weather: {
				atmosphere_type: 0,
				cyclones: {},
				dust_density: 0,
				enable_dust: false,
				enable_fog: false,
				fog: {
					density: 0,
					thickness: 0,
					visibility: 0,
				},
				groundTurbulence: 0,
				halo: {
					preset: "auto",
				},
				modifiedTime: false,
				name: "DCC Weather",
				qnh: 0,
				season: {
					temperature: this.weather.temperature,
				},
				type_weather: 0,
				visibility: {
					distance: 80000 - this.weather.cloudCover * 10000,
				},
				wind: {
					at8000: {
						speed: this.weather.wind.speed * 3,
						dir: this.weather.wind.direction,
					},
					atGround: {
						speed: this.weather.wind.speed,
						dir: this.weather.wind.direction,
					},
					at2000: {
						speed: this.weather.wind.speed * 1.5,
						dir: this.weather.wind.direction,
					},
				},
				clouds: {
					density: Math.round(this.weather.cloudCover * 10),
					thickness: Math.round(this.weather.cloudCover * 200),
					base: 9144 - this.weather.cloudCover * 10150,
					iprecptns: this.weather.cloudCover > 0.6 ? 1 : 0,
				},
				/* atmosphere_type: 0,
				wind: {
					at8000: {
						speed: 0,
						dir: 0,
					},
					atGround: {
						speed: 0,
						dir: 0,
					},
					at2000: {
						speed: 0,
						dir: 0,
					},
				},
				enable_fog: false,
				visibility: {
					distance: 80000,
				},
				halo: {
					preset: "auto",
				},
				fog: {
					thickness: 0,
					visibility: 0,
				},
				season: {
					temperature: 20,
				},
				type_weather: 0,
				qnh: 760,
				cyclones: {},
				name: "Winter, clean sky",
				dust_density: 0,
				modifiedTime: false,
				groundTurbulence: 0,
				enable_dust: false,
				clouds: {
					thickness: 200,
					density: 0,
					preset: "Preset2",
					base: 2500,
					iprecptns: 0,
				}, */
			},
		};
	}

	public toMissionConfig() {
		const config = {
			missionId: this.#id,
		};

		return luaTable.stringify(config, { mixedKeyTypes: true });
	}
	public toMissionLuaTable() {
		const generatedMission = this.toGenerated();

		return luaTable.stringify(generatedMission, { mixedKeyTypes: true });
	}

	public toWarehouseLuaTable() {
		const theatre = Data.Theatres[this.theatre];

		if (theatre == null) {
			throw new Error(`Theatre ${this.theatre} not found`);
		}

		const warehouse: Data.GeneratedTypes.Warehouse = {
			airports: {},
			warehouses: {},
		};

		Object.values(theatre.airdromeDefinitions).map((ad) => {
			warehouse.airports[ad.id] = {
				aircrafts: {},
				coalition: this.airdromes.blue?.has(ad.name) ? "BLUE" : this.airdromes.red?.has(ad.name) ? "RED" : "NEUTRAL",
				diesel: {
					InitFuel: 100,
				},
				gasoline: {
					InitFuel: 100,
				},
				jet_fuel: {
					InitFuel: 100,
				},
				methanol_mixture: {
					InitFuel: 100,
				},
				OperatingLevel_Air: 10,
				OperatingLevel_Eqp: 10,
				OperatingLevel_Fuel: 10,
				periodicity: 30,
				size: 100,
				speed: 16.666666,
				suppliers: {},
				unlimitedAircrafts: true,
				unlimitedFuel: true,
				unlimitedMunitions: true,
				weapons: {},
			};
		});

		return luaTable.stringify(warehouse, { mixedKeyTypes: true });
	}
}
