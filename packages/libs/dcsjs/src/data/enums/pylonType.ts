import * as z from "zod";

export const pylonType = z.enum(["Fuel Tank", "Targeting Pod", "Gun Pod", "ECM Pod", "Other", "Weapon"]);
export type PylonType = z.TypeOf<typeof pylonType>;
