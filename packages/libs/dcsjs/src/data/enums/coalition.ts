import * as z from "zod";

export const coalition = z.enum(["blue", "red", "neutrals"]);
export type Coalition = z.TypeOf<typeof coalition>;
