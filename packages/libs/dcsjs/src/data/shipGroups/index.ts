import { ShipGroup } from "../generatedTypes";
import { abrahamLincoln } from "./abrahamLincoln";
import { forrestal } from "./forrestal";

export const shipGroups: Record<string, ShipGroup> = {
	"CVN-72 Abraham Lincoln": abrahamLincoln,
	"CV-59 Forrestal": forrestal,
};
