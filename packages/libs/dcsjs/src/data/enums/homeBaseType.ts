import * as z from "zod";

export const homeBaseType = z.enum(["Airdrome", "Farp", "Carrier"]);
export type HomeBaseType = z.TypeOf<typeof homeBaseType>;
