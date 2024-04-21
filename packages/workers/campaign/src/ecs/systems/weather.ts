import * as DcsJs from "@foxdelta2/dcsjs";
import * as Utils from "@kilcekru/dcc-shared-utils";

import { store } from "../store";

export function getTemperature(args: { timer: number; temperatureOffset: number; cloudCover: number }) {
	const hours = args.timer / 60 / 60;
	const theatreInfo = DcsJs.Theatres[store.theatre].info;
	const temperatureAmplitude = theatreInfo.weather.temperature.amplitude ?? 10; // Amplitude of temperature variation
	const temperatureMean = theatreInfo.weather.temperature.mean ?? 25; // Mean temperature for the day
	const period = 24; // Number of hours in a day
	const hoursOffset = 15;

	const angle = ((hours + hoursOffset) / period) * 2 * Math.PI; // Calculate the angle based on the time
	const temperature =
		temperatureMean + temperatureAmplitude * Math.sin(angle) + args.temperatureOffset - args.cloudCover * 10;

	return Math.round(temperature);
}

export function generateCloudCover(baseCloudCover: number, seasonalEffect: number) {
	const maxHourlyIncrease = 0.2; // Max increase due to time of day
	const days = 10;

	const period = 24 * days; // Number of hours in the entire period

	const cloudCoverData: number[] = [];

	for (let hour = 0; hour < period; hour++) {
		const timeOfDayFactor = 1 + maxHourlyIncrease * Math.cos(((hour + 12) / period) * 2 * Math.PI);

		const randomNoise = Math.random() * 0.5 - 0.25; // Adjusted random noise

		let cloudCover = baseCloudCover * timeOfDayFactor * (1 + seasonalEffect) + randomNoise;

		// Ensure cloudCover is within [0, 1] range
		cloudCover = Math.max(0, Math.min(1, cloudCover));

		cloudCoverData.push(Utils.round(cloudCover, 3));
	}

	return cloudCoverData;
}

export function getCloudCover(args: { timer: number; cloudCoverData: Array<number>; allowBadWeather: boolean }) {
	const hours = Utils.round(args.timer / 60 / 60, 0);

	const i = hours % args.cloudCoverData.length;

	const cover = args.cloudCoverData[i] ?? 0;

	return args.allowBadWeather ? cover : Utils.mapRange(cover, 0, 1, 0, 0.6);
}

export function getWind(cloudCover: number) {
	const theatreInfo = DcsJs.Theatres[store.theatre].info;

	const speed = Math.max(0.1, theatreInfo.weather.wind.speed + cloudCover * 2);
	const direction = theatreInfo.weather.wind.direction + Utils.Random.number(-20, 20);

	return {
		speed,
		direction,
	};
}

function calcCurrentWeather(args: {
	timer: number;
	temperatureOffset: number;
	cloudCoverData: number[];
	allowBadWeather: boolean;
}) {
	const cloudCover = getCloudCover(args);
	const temperature = getTemperature({ ...args, cloudCover });
	const wind = getWind(cloudCover);

	return {
		cloudCover,
		temperature,
		wind,
	};
}

export function updateWeather() {
	const currentWeather = calcCurrentWeather({
		timer: store.time / 1000,
		temperatureOffset: store.weather.offset,
		cloudCoverData: store.weather.cloudCoverData,
		allowBadWeather: store.campaignParams.badWeather ?? false,
	});

	store.weather.temperature = currentWeather.temperature;
	store.weather.cloudCover = currentWeather.cloudCover;
	store.weather.wind = currentWeather.wind;
}
