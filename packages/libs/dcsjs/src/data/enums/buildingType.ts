import * as z from "zod";

export const buildingType = z.enum([
  ".Command Center",
  "Electric power box",
  "Garage B",
  "Tech hangar A",
  "Repair workshop",
  "FARP",
  "FARP Ammo Dump Coating",
  "FARP CP Blindage",
  "FARP Fuel Depot",
  "FARP Tent",
  "Chemical tank A",
  "Hangar B",
  "Workshop A",
  "Subsidiary structure 2",
  "Boiler-house A",
  "Military staff",
  "Small werehouse 2",
  "TV tower",
  "Railway station",
  "FARP_SINGLE_01",
  "outpost",
]);
export type BuildingType = z.TypeOf<typeof buildingType>;
