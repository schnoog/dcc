import * as Data from "../data";
import { Group } from "./Group";
import { Mission } from "./Mission";

export abstract class UnitGroup extends Group {
  public override toGenerated(mission: Mission): Data.GeneratedTypes.UnitGroup {
    return {
      ...super.toGenerated(mission),
      start_time: 0,
      hidden: false,
      tasks: [],
    };
  }
}
