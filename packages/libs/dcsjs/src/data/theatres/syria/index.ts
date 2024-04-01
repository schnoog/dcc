import { TheatreData } from "../../types";
import { airdromeDefinitions } from "./airdromeDefinitions";
import { objectives } from "./objectives";
import { targets } from "./targets";

export const Syria: TheatreData = {
  objectives,
  targets,
  airdromeDefinitions,
  info: {
    center: {
      y: -50203,
      x: -238900,
    },
    weather: {
      temperature: {
        amplitude: 10,
        mean: 30,
      },
      cloudCover: {
        baseCloudCover: 0,
        seasonEffect: 0,
      },
      wind: {
        speed: 2,
        direction: 0,
      },
    },
    night: {
      startHour: 19,
      endHour: 6,
    },
  },
};
