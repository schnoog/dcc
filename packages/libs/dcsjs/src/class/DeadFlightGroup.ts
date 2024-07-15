import * as Data from "../data";
import { FlightGroup, FlightGroupProps } from "./FlightGroup";

export type DeadFlightGroupProps = FlightGroupProps & {
	target: Data.InputTypes.SamGroup;
};

export class DeadFlightGroup extends FlightGroup {
	#target: Data.InputTypes.SamGroup;

	get target() {
		return this.#target;
	}

	constructor(args: DeadFlightGroupProps) {
		super(args);

		this.#target = args.target;
	}
}
