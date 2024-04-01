import * as z from "zod";

export const aiSkill = z.enum(["Average", "Good", "High", "Excellent"]);
export type AiSkill = z.TypeOf<typeof aiSkill>;

export const skill = z.union([aiSkill, z.literal("Client")]);
export type Skill = z.TypeOf<typeof skill>;
