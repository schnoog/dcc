import * as Data from "../data";
import { FlightGroup, FlightGroupProps } from "./FlightGroup";

export type CasFlightGroupProps = FlightGroupProps & {
	target: Data.InputTypes.GroundGroup;
};

export class CasFlightGroup extends FlightGroup {
	#target: Data.InputTypes.GroundGroup;

	get target() {
		return this.#target;
	}

	constructor(args: CasFlightGroupProps) {
		super(args);

		this.#target = args.target;
	}
}
