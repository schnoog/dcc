import * as z from "zod";

export const targetType = z.enum(["Vehicle", "AAA", "Artillery", "SAM", "Structure", "Farp", "EW"]);
export type TargetType = z.TypeOf<typeof targetType>;
