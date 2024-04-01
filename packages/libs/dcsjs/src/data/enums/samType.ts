import * as z from "zod";

export const samType = z.enum(["SA-10-300", "SA-6", "SA-5", "SA-3", "SA-2", "Hawk"]);
export type SamType = z.infer<typeof samType>;
