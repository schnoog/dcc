import * as z from "zod";

import * as Enums from "./enums";
import * as Types from "./types";

export namespace Schema {
  export const mission = z.object({
    id: z.string(),
    theatre: Enums.theatre,
    time: z.number(),
    weather: Types.Schema.weather,
    date: z.date(),
    aiSkill: Enums.aiSkill,
    airdromes: z.record(Enums.coalition, z.set(z.string())),
    countries: z.record(Enums.coalition, Enums.countryName),
    hotStart: z.boolean().optional(),
  });

  export const group = z.object({
    countryName: Enums.countryName,
    name: z.string(),
    position: Types.Schema.position,
    objectiveName: z.string().optional(),
  });

  export const groundUnit = z.object({
    name: z.string(),
    type: Enums.groundUnitType,
  });

  export const groundGroup = group.extend({
    units: z.array(groundUnit),
  });

  export const samGroup = group.extend({
    units: z.array(groundUnit),
  });

  export const building = z.object({
    name: z.string(),
    type: Enums.buildingType,
    position: Types.Schema.position,
  });

  export const staticGroup = group.extend({
    units: z.array(building),
  });

  export const flightGroupUnit = z.object({
    name: z.string(),
    type: Enums.aircraftType,
    callsign: Types.Schema.callsign,
    onboardNumber: z.number(),
    isClient: z.boolean(),
    pylons: z.array(Types.Schema.pylon),
  });

  export const waypoint = z.object({
    name: z.string(),
    position: Types.Schema.position,
    onGround: z.boolean(),
    arrivalTime: z.number(),
    duration: z.number().optional(),
    type: Enums.waypointType,
  });

  export const flightGroup = group.extend({
    units: z.array(flightGroupUnit),
    task: Enums.task,
    frequency: z.number(),
    waypoints: z.array(waypoint),
    cruiseSpeed: z.number(),
    startTime: z.number(),
    homeBaseName: z.string(),
    homeBaseType: Enums.homeBaseType,
    coalition: Enums.coalition,
    hasClients: z.boolean(),
  });

  export const generateAWACS = z.record(Enums.coalition, Enums.aircraftType);
}

export type Mission = z.infer<typeof Schema.mission>;
export type Group = z.infer<typeof Schema.group>;
export type GroundUnit = z.infer<typeof Schema.groundUnit>;
export type GroundGroup = z.infer<typeof Schema.groundGroup>;
export type SamGroup = z.infer<typeof Schema.samGroup>;
export type Building = z.infer<typeof Schema.building>;
export type StaticGroup = z.infer<typeof Schema.staticGroup>;
export type FlightGroupUnit = z.infer<typeof Schema.flightGroupUnit>;
export type FlightGroup = z.infer<typeof Schema.flightGroup>;
export type Waypoint = z.infer<typeof Schema.waypoint>;
export type GenerateAWACS = z.infer<typeof Schema.generateAWACS>;
