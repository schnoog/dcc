import * as Data from "../data";
import { FlightGroup, FlightGroupProps } from "./FlightGroup";

export type CapFlightGroupProps = FlightGroupProps & {
	target: Data.Position;
};

export class CapFlightGroup extends FlightGroup {
	#target: Data.Position;

	get target() {
		return this.#target;
	}

	constructor(args: CapFlightGroupProps) {
		super(args);

		this.#target = args.target;
	}
}
