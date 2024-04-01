import * as z from "zod";

export const theatre = z.enum(["Caucasus", "Normandy", "PersianGulf", "SouthAtlantic", "Syria"]);
export type Theatre = z.TypeOf<typeof theatre>;
