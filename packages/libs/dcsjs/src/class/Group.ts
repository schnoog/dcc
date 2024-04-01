import * as Data from "../data";
import { Mission } from "./Mission";

export interface GroupProps {
  name: string;
  groupId: number;
  position: Data.Position;
}

export abstract class Group {
  readonly name: string;
  readonly groupId: number;
  readonly position: Data.Position;

  constructor(args: GroupProps) {
    this.name = args.name;
    this.groupId = args.groupId;
    this.position = args.position;
  }

  public toGenerated(_mission: Mission): Data.GeneratedTypes.Group {
    return {
      groupId: this.groupId,
      name: this.name,
      x: this.position.x,
      y: this.position.y,
    };
  }
}
