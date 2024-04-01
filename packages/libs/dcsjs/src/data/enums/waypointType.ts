import * as z from "zod";

export const waypointType = z.enum([
  "TakeOff",
  "Landing",
  "Task",
  "Nav",
  "Hold",
  "RaceTrack End",
]);
export type WaypointType = z.TypeOf<typeof waypointType>;
