import * as Data from "../data";
import { Group, GroupProps } from "./Group";
import type { Mission } from "./Mission";

interface StaticGroupProps extends GroupProps {
  buildingName: string;
  buildingType: Data.BuildingType;
  unitId: number;
}

export class StaticGroup extends Group {
  readonly buildingName: string;
  readonly buildingType: Data.BuildingType;
  readonly unitId: number;

  constructor(args: StaticGroupProps) {
    super(args);
    this.buildingName = args.buildingName;
    this.buildingType = args.buildingType;
    this.unitId = args.unitId;
  }

  public override toGenerated(
    mission: Mission
  ): Data.GeneratedTypes.StaticGroup {
    const building = Data.buildings[this.buildingType];

    const units: Data.GeneratedTypes.StaticUnit[] = [
      {
        category: building.category,
        heading: 0,
        name: this.buildingName,
        rate: 100,
        shape_name: building.shapeName,
        type: building.type,
        unitId: this.unitId,
        x: this.position.x,
        y: this.position.y,
      },
    ];

    return {
      ...super.toGenerated(mission),
      units,
      dead: false,
      heading: 0,
      route: {
        points: [
          {
            alt: 0,
            type: "",
            name: "",
            y: this.position.y,
            x: this.position.x,
            speed: 0,
            formation_template: "",
            action: "",
          },
        ],
      },
    };
  }
}
