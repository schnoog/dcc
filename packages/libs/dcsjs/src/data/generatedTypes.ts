import * as z from "zod";

import * as Enums from "./enums";
import * as Types from "./types";

export namespace Schema {
	export const routePointAction = z.enum([
		"From Parking Area",
		"From Parking Area Hot",
		"From Ground Area",
		"From Runway",
		"Turning Point",
		"Landing",
	]);
	export const groundRoutePointAction = z.enum(["Off Road", "On Road"]);
	export const routePointType = z.enum([
		"TakeOffParking",
		"TakeOffParkingHot",
		"TakeOffGround",
		"TakeOff",
		"Turning Point",
		"Land",
	]);

	export const routePointTaskAction = Types.Schema.routePointTaskTemplate.extend({
		number: z.number(),
	});
	export const routePointTask = z.object({
		id: z.literal("ComboTask"),
		params: z.object({
			tasks: z.array(routePointTaskAction).or(z.object({})),
		}),
	});
	export const baseRoutePoint = Types.Schema.position.extend({
		alt: z.number(),
		type: z.union([routePointType, z.literal("")]),
		speed: z.number(),
		formation_template: z.string().optional(),
		action: z.literal(""),
		name: z.string().optional(),
	});
	export const routePoint = baseRoutePoint.extend({
		ETA: z.number(),
		ETA_locked: z.boolean(),
		alt_type: Enums.altitudeType,
		speed: z.number(),
		speed_locked: z.boolean(),
		task: routePointTask.optional(),
		airdromeId: z.number().optional(),
		linkUnit: z.number().optional(),
		helipadId: z.number().optional(),
		action: routePointAction,
	});
	export const groundRoutePoint = baseRoutePoint.extend({
		ETA: z.number(),
		ETA_locked: z.boolean(),
		alt_type: Enums.altitudeType,
		speed: z.number(),
		speed_locked: z.boolean(),
		task: routePointTask.optional(),
		airdromeId: z.number().optional(),
		linkUnit: z.number().optional(),
		helipadId: z.number().optional(),
		action: groundRoutePointAction,
	});
	export const route = z.object({
		points: z.array(routePoint),
	});

	export const payload = z.object({
		chaff: z.number(),
		flare: z.number(),
		fuel: z.number(),
		gun: z.number().optional(),
		ammo_type: z.number().optional(),
		pylons: z.array(Types.Schema.pylon).or(z.object({})),
	});
	export const radio = z.object({
		modulations: z.array(z.number()).or(z.object({})),
		channels: z.array(z.number()).or(z.object({})),
		channelsNames: z.array(z.string()).or(z.object({})),
	});

	export const unit = Types.Schema.position.extend({
		name: z.string(),
		unitId: z.number(),
	});
	export const group = Types.Schema.position.extend({
		name: z.string(),
		groupId: z.number(),
	});
	export const unitGroup = group.extend({
		start_time: z.number(),
		hidden: z.boolean(),
		tasks: z.object({}), // TODO
	});
	export const flightGroupUnit = unit.extend({
		alt: z.number(),
		alt_type: Enums.altitudeType,
		callsign: Types.Schema.callsign,
		onboard_num: z.string(),
		parking: z.string().optional(),
		parking_id: z.string().optional(),
		livery_id: z.string(),
		payload: payload,
		psi: z.number(),
		skill: Enums.skill,
		speed: z.number(),
		type: Enums.aircraftType,
		Radio: z.array(radio).optional(),
		linkUnit: z.number().optional(),
		helipadId: z.number().optional(),
		AddPropAircraft: z.record(z.string(), z.string().or(z.number())).optional(),
		datalinks: z.object({}).optional(), // TODO
	});
	export const flightGroup = unitGroup.extend({
		lateActivation: z.boolean().optional(),
		communication: z.boolean(),
		frequency: z.number(),
		hiddenOnMFD: z.boolean().optional(),
		hiddenOnPlanner: z.boolean().optional(),
		modulation: z.number(),
		radioSet: z.boolean(),
		task: Enums.task,
		uncontrolled: z.boolean(),
		units: z.array(flightGroupUnit),
		route,
	});

	export const groundUnit = unit.extend({
		skill: Enums.aiSkill,
		coldAtStart: z.boolean(),
		type: Enums.groundUnitType,
		heading: z.number(),
	});
	export const groundGroup = unitGroup.extend({
		visible: z.boolean(),
		task: z.literal("Ground Nothing").optional(),
		taskSelected: z.boolean().optional(),
		uncontrollable: z.boolean(),
		hidden: z.boolean(),
		units: z.array(groundUnit),
		route: z.object({
			points: z.array(groundRoutePoint),
		}),
	});

	export const shipUnit = unit.extend({
		modulation: z.number(),
		skill: Enums.aiSkill,
		type: z.string(),
		heading: z.number(),
		frequency: z.number(),
	});
	export const shipGroup = unitGroup.extend({
		visible: z.boolean(),
		uncontrollable: z.boolean(),
		route,
		units: z.array(shipUnit),
	});

	export const staticUnit = Types.Schema.position.extend({
		category: z.string(),
		shape_name: z.string().optional(),
		type: z.string(),
		unitId: z.number(),
		rate: z.number(),
		name: z.string(),
		heading: z.number(),
	});
	export const staticGroup = group.extend({
		heading: z.number(),
		units: z.array(staticUnit),
		dead: z.boolean(),
		route: z.object({
			points: z.array(baseRoutePoint),
		}),
	});

	export const country = z.object({
		id: z.number(),
		name: Enums.countryName,
		plane: z
			.object({
				group: z.array(flightGroup).or(z.object({})),
			})
			.optional(),
		helicopter: z
			.object({
				group: z.array(flightGroup).or(z.object({})),
			})
			.optional(),
		vehicle: z
			.object({
				group: z.array(groundGroup),
			})
			.optional(),
		static: z
			.object({
				group: z.array(staticGroup).or(z.object({})),
			})
			.optional(),
	});

	export const coalition = z.object({
		country: z.array(country).or(z.object({})),
		bullseye: z.object({
			x: z.number(),
			y: z.number(),
		}),
		name: z.string(),
		nav_points: z.object({}),
	});
	export const missionDate = z.object({
		Day: z.number(),
		Month: z.number(),
		Year: z.number(),
	});

	export const altitudeWind = z.object({
		speed: z.number(),
		dir: z.number(),
	});
	export const weather = z.object({
		atmosphere_type: z.number(),
		wind: z.object({
			at8000: altitudeWind,
			atGround: altitudeWind,
			at2000: altitudeWind,
		}),
		enable_fog: z.boolean(),
		visibility: z.object({
			distance: z.number(),
		}),
		halo: z.object({
			preset: z.enum(["auto", "off"]),
		}),
		fog: z.object({
			thickness: z.number(),
			visibility: z.number(),
			density: z.number().optional(),
		}),
		season: z.object({
			temperature: z.number(),
		}),
		type_weather: z.number(),
		qnh: z.number(),
		cyclones: z.object({}),
		name: z.string(),
		dust_density: z.number(),
		modifiedTime: z.boolean(),
		groundTurbulence: z.number(),
		enable_dust: z.boolean(),
		clouds: z.object({
			thickness: z.number(),
			density: z.number(),
			preset: z.string().optional(),
			base: z.number(),
			iprecptns: z.number(),
		}),
	});

	export const triggerZone = z.object({
		radius: z.number(),
		zoneId: z.number(),
		color: z.tuple([z.number(), z.number(), z.number(), z.number()]),
		properties: z.object({}),
		hidden: z.boolean(),
		y: z.number(),
		x: z.number(),
		name: z.string(),
		heading: z.number(),
		type: z.number(),
	});

	export const mission = z.object({
		coalitions: z.record(Enums.coalition, z.array(z.number()).or(z.object({}))),
		coalition: z.record(Enums.coalition, coalition),
		theatre: Enums.theatre,
		weather: weather,
		date: missionDate,
		currentKey: z.number(),
		version: z.number(),
		sortie: z.string(),
		start_time: z.number(),
		failures: z.object({}), // unknown
		goals: z.object({}), // unknown
		triggers: z.object({
			zones: z.array(triggerZone).or(z.object({})), // TODO
		}),
		trig: z.object({
			actions: z.object({}),
			events: z.object({}),
			custom: z.object({}),
			func: z.object({}),
			flag: z.object({}),
			conditions: z.object({}),
			customStartup: z.object({}),
			funcStartup: z.object({}),
		}),
		trigrules: z.array(Types.Schema.triggerRule).or(z.object({})),
		map: z.object({
			centerX: z.number(),
			centerY: z.number(),
			zoom: z.number(),
		}),
		groundControl: z.object({
			passwords: z.object({
				artillery_commander: z.object({}),
				instructor: z.object({}),
				observer: z.object({}),
				forward_observer: z.object({}),
			}),
			roles: z.object({
				artillery_commander: z.record(Enums.coalition, z.number()),
				instructor: z.record(Enums.coalition, z.number()),
				observer: z.record(Enums.coalition, z.number()),
				forward_observer: z.record(Enums.coalition, z.number()),
			}),
			isPilotControlVehicles: z.boolean(),
		}),
		descriptionBlueTask: z.string(),
		descriptionRedTask: z.string(),
		descriptionText: z.string(),
		descriptionNeutralsTask: z.string(),
		maxDictId: z.number(),
		pictureFileNameN: z.array(z.string()).or(z.object({})),
		pictureFileNameR: z.array(z.string()).or(z.object({})),
		pictureFileNameB: z.array(z.string()).or(z.object({})),
	});

	export const warehouseAirport = z.object({
		OperatingLevel_Air: z.number(),
		OperatingLevel_Eqp: z.number(),
		OperatingLevel_Fuel: z.number(),
		aircrafts: z.object({}),
		coalition: z.enum(["BLUE", "RED", "NEUTRAL"]),
		diesel: z.object({
			InitFuel: z.number(),
		}),
		gasoline: z.object({
			InitFuel: z.number(),
		}),
		jet_fuel: z.object({
			InitFuel: z.number(),
		}),
		methanol_mixture: z.object({
			InitFuel: z.number(),
		}),
		periodicity: z.literal(30),
		size: z.literal(100),
		speed: z.literal(16.666666),
		suppliers: z.object({}),
		unlimitedAircrafts: z.literal(true),
		unlimitedFuel: z.literal(true),
		unlimitedMunitions: z.literal(true),
		weapons: z.object({}),
	});

	export const warehouse = z.object({
		airports: z.record(z.number(), warehouseAirport),
		warehouses: z.object({}),
	});
}

export type Country = z.TypeOf<typeof Schema.country>;
export type MissionDate = z.TypeOf<typeof Schema.missionDate>;
export type Weather = z.TypeOf<typeof Schema.weather>;
export type GroundUnit = z.TypeOf<typeof Schema.groundUnit>;
export type GroundGroup = z.TypeOf<typeof Schema.groundGroup>;
export type Mission = z.TypeOf<typeof Schema.mission>;
export type Warehouse = z.TypeOf<typeof Schema.warehouse>;
export type StaticUnit = z.TypeOf<typeof Schema.staticUnit>;
export type StaticGroup = z.TypeOf<typeof Schema.staticGroup>;
export type FlightGroupUnit = z.TypeOf<typeof Schema.flightGroupUnit>;
export type FlightGroup = z.TypeOf<typeof Schema.flightGroup>;
export type Group = z.TypeOf<typeof Schema.group>;
export type UnitGroup = z.TypeOf<typeof Schema.unitGroup>;
export type ShipGroup = z.TypeOf<typeof Schema.shipGroup>;
export type RoutePoint = z.TypeOf<typeof Schema.routePoint>;
export type RoutePointTaskAction = z.TypeOf<typeof Schema.routePointTaskAction>;
export type RoutePointTask = z.TypeOf<typeof Schema.routePointTask>;
