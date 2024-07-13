import * as Data from "../data";
import { FlightGroup, FlightGroupProps } from "./FlightGroup";

export type StrikeFlightGroupProps = FlightGroupProps & {
	target: Data.InputTypes.StaticGroup;
};

export class StrikeFlightGroup extends FlightGroup {
	#target: Data.InputTypes.StaticGroup;

	get target() {
		return this.#target;
	}

	constructor(args: StrikeFlightGroupProps) {
		super(args);

		this.#target = args.target;
	}
}
