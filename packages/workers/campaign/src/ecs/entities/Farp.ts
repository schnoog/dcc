import * as DcsJs from "@foxdelta2/dcsjs";
import type * as Types from "@kilcekru/dcc-shared-types";
import * as Utils from "@kilcekru/dcc-shared-utils";

import { Events, Serialization } from "../../utils";
import { Structure } from "./_base";
import { HomeBase, HomeBaseProps } from "./_base/HomeBase";
import { Building } from "./Building";

export interface FarpProps extends Omit<HomeBaseProps, "entityType" | "type"> {
	objectiveId: string;
	buildingIds: Types.Campaign.Id[];
}

export class Farp extends HomeBase<keyof Events.EventMap.Farp> {
	public readonly objectiveId: string;
	public readonly buildingIds: Types.Campaign.Id[];

	private constructor(args: FarpProps | Types.Serialization.FarpSerialized) {
		const superArgs = Serialization.isSerialized(args)
			? args
			: { ...args, type: "Farp" as const, entityType: "Farp" as const };
		super(superArgs);
		this.objectiveId = args.objectiveId;
		this.buildingIds = args.buildingIds;
	}

	static createBuildings(args: Pick<FarpProps, "name" | "coalition">) {
		const structureTemplate = Utils.Random.item(DcsJs.structures["Farp"]);

		if (structureTemplate == null) {
			throw new Error("structureTemplate not found");
		}

		return structureTemplate.buildings.map((buildingTemplate, i) => {
			return Building.create({
				name: `${args.name}|${i + 1}`,
				offset: buildingTemplate.offset,
				coalition: args.coalition,
				buildingType: buildingTemplate.type,
			});
		});
	}

	static create(args: Omit<FarpProps, "buildingIds">) {
		const buildings = Structure.createBuildings({ ...args, structureType: "Farp" });

		const f = new Farp({
			...args,
			buildingIds: buildings.map((building) => building.id),
		});
		f.generateAircraftsForHomeBase({ coalition: args.coalition, homeBaseType: "Farp" });

		return f;
	}

	override toMapJSON(): Types.Campaign.AirdromeMapItem {
		return {
			...super.toMapJSON(),
			coalition: this.coalition,
			type: "airdrome",
		};
	}

	override toJSON() {
		return {
			...super.toJSON(),
		};
	}

	static deserialize(args: Types.Serialization.FarpSerialized) {
		return new Farp(args);
	}

	public override serialize(): Types.Serialization.FarpSerialized {
		return {
			...super.serialize(),
			entityType: "Farp",
			objectiveId: this.objectiveId,
			buildingIds: this.buildingIds,
		};
	}
}
