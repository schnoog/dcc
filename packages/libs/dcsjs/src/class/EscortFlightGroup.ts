import * as Data from "../data";
import { FlightGroup, FlightGroupProps } from "./FlightGroup";

export type StrikeFlightGroupProps = FlightGroupProps & {
	target: Data.InputTypes.FlightGroup;
};

export class EscortFlightGroup extends FlightGroup {
	#target: Data.InputTypes.FlightGroup;

	get target() {
		return this.#target;
	}

	constructor(args: StrikeFlightGroupProps) {
		super(args);

		this.#target = args.target;
	}
}
