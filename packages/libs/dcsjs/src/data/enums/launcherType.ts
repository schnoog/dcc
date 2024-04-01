import * as z from "zod";

export const launcherType = z.enum([
  "Weapon",
  "Fuel Tank",
  "Targeting Pod",
  "Gun Pod",
  "ECM Pod",
  "Other",
]);
export type LauncherType = z.TypeOf<typeof launcherType>;
