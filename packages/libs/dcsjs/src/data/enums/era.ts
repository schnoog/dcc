import * as z from "zod";

export const era = z.enum(["WW2", "Korea", "Early CW", "Late CW", "Modern"]);
export type Era = z.TypeOf<typeof era>;
