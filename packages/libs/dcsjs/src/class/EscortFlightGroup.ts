import * as Data from "../data";
import { FlightGroup, FlightGroupProps } from "./FlightGroup";

export type EscortFlightGroupProps = FlightGroupProps & {
	target: Data.InputTypes.FlightGroup;
};

export class EscortFlightGroup extends FlightGroup {
	#target: Data.InputTypes.FlightGroup;

	get target() {
		return this.#target;
	}

	constructor(args: EscortFlightGroupProps) {
		super(args);

		this.#target = args.target;
	}
}
