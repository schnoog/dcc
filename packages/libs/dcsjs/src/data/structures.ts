import { StructureType } from "./enums";
import { StructureBuilding } from "./types";

export const structures: Record<
  StructureType,
  Array<{
    buildings: StructureBuilding[];
  }>
> = {
  "Ammo Depot": [
    {
      buildings: [
        {
          offset: {
            x: 0,
            y: 0,
          },
          type: "Electric power box",
        },
        {
          offset: {
            x: -30,
            y: 0,
          },
          type: "Electric power box",
        },
        {
          offset: {
            x: -50,
            y: 0,
          },
          type: "Electric power box",
        },
        {
          offset: {
            x: -70,
            y: 0,
          },
          type: "Electric power box",
        },
        {
          offset: {
            x: 0,
            y: 70,
          },
          type: "Garage B",
        },
        {
          offset: {
            x: -50,
            y: 70,
          },
          type: "Garage B",
        },
      ],
    },
  ],
  Barrack: [
    {
      buildings: [
        {
          offset: {
            x: 0,
            y: 0,
          },
          type: "Garage B",
        },
        {
          offset: {
            x: 0,
            y: 70,
          },
          type: "Garage B",
        },
        {
          offset: {
            x: -70,
            y: -75,
          },
          type: "Tech hangar A",
        },
        {
          offset: {
            x: -123,
            y: -75,
          },
          type: "Tech hangar A",
        },
      ],
    },
  ],
  Depot: [
    {
      buildings: [
        {
          offset: {
            x: 0,
            y: 0,
          },
          type: "Repair workshop",
        },
        {
          offset: {
            x: 0,
            y: 120,
          },
          type: "Repair workshop",
        },
      ],
    },
  ],
  Farp: [
    {
      buildings: [
        {
          offset: {
            x: 0,
            y: 0,
          },
          type: "FARP",
        },
        {
          offset: {
            x: 75,
            y: -75,
          },
          type: "FARP Ammo Dump Coating",
        },
        {
          offset: {
            x: -60,
            y: -75,
          },
          type: "FARP CP Blindage",
        },
        {
          offset: {
            x: 10,
            y: -75,
          },
          type: "FARP Fuel Depot",
        },
        {
          offset: {
            x: 50,
            y: -75,
          },
          type: "FARP Tent",
        },
        {
          offset: {
            x: -20,
            y: -75,
          },
          type: "FARP Tent",
        },
      ],
    },
  ],
  "Fuel Storage": [
    {
      buildings: [
        {
          offset: {
            x: 0,
            y: 0,
          },
          type: "Chemical tank A",
        },
        {
          offset: {
            x: 0,
            y: 100,
          },
          type: "Chemical tank A",
        },
        {
          offset: {
            x: 0,
            y: 200,
          },
          type: "Chemical tank A",
        },
        {
          offset: {
            x: 100,
            y: 100,
          },
          type: "Hangar B",
        },
      ],
    },
  ],
  "Power Plant": [
    {
      buildings: [
        {
          offset: {
            x: 0,
            y: 0,
          },
          type: "Workshop A",
        },
        {
          offset: {
            x: 0,
            y: 125,
          },
          type: "Workshop A",
        },
        {
          offset: {
            x: 200,
            y: -100,
          },
          type: "Subsidiary structure 2",
        },
        {
          offset: {
            x: 200,
            y: 100,
          },
          type: "Hangar B",
        },
        {
          offset: {
            x: 250,
            y: 200,
          },
          type: "Boiler-house A",
        },
      ],
    },
  ],
  "Command Center": [
    {
      buildings: [
        {
          offset: {
            x: 0,
            y: 0,
          },
          type: "Military staff",
        },
        {
          offset: {
            x: -50,
            y: 175,
          },
          type: "Small werehouse 2",
        },
        {
          offset: {
            x: 100,
            y: 175,
          },
          type: "Small werehouse 2",
        },
        {
          offset: {
            x: 0,
            y: 200,
          },
          type: "TV tower",
        },
      ],
    },
  ],
  Hospital: [
    {
      buildings: [
        {
          offset: {
            x: 0,
            y: 0,
          },
          type: "Military staff",
        },
        {
          offset: {
            x: 0,
            y: 35,
          },
          type: "Railway station",
        },
        {
          offset: {
            x: 0,
            y: -35,
          },
          type: "Railway station",
        },
        {
          offset: {
            x: 60,
            y: 0,
          },
          type: "FARP_SINGLE_01",
        },
      ],
    },
  ],
  Prison: [
    {
      buildings: [
        {
          offset: {
            x: 0,
            y: 0,
          },
          type: "Military staff",
        },
        {
          offset: {
            x: 0,
            y: -35,
          },
          type: "outpost",
        },
        {
          offset: {
            x: -40,
            y: 25,
          },
          type: "Railway station",
        },
        {
          offset: {
            x: -75,
            y: 25,
          },
          type: "Railway station",
        },
        {
          offset: {
            x: -40,
            y: -50,
          },
          type: "Railway station",
        },
        {
          offset: {
            x: -75,
            y: -50,
          },
          type: "Railway station",
        },
        {
          offset: {
            x: -145,
            y: 0,
          },
          type: "outpost",
        },
      ],
    },
  ],
};
