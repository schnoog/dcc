import * as z from "zod";

export const vehicleType = z.enum([
  "Unarmored",
  "Track Radar",
  "Search Radar",
  "Control Unit",
  "SAM Launcher",
  "Refuel",
  "Transport",
  "SHORAD",
  "Power Generator",
]);
export type VehicleType = z.TypeOf<typeof vehicleType>;
