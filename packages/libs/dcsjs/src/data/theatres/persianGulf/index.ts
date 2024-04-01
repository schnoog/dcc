import { TheatreData } from "../../types";
import { airdromeDefinitions } from "./airdromeDefinitions";
import { objectives } from "./objectives";
import { targets } from "./targets";

export const PersianGulf: TheatreData = {
	objectives,
	targets,
	airdromeDefinitions,
	info: {
		center: {
			y: 117471.88392351,
			x: -36568.319408418,
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
