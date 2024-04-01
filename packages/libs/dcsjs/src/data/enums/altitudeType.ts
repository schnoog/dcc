import * as z from "zod";

export const altitudeType = z.enum(["RADIO", "BARO"]);
export type AltitudeType = z.infer<typeof altitudeType>;
