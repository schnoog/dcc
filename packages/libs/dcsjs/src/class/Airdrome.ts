import * as Data from "../data";

export interface AirdromeProps {
  name: string;
  theatre: Data.Theatre;
}

type Stand = Data.AirdromeStand & {
  inUse: { from: number; to: number }[];
};

export class Airdrome {
  #name: string;
  #theatre: Data.Theatre;
  #stands: Stand[] = [];

  constructor(props: AirdromeProps) {
    this.#name = props.name;
    this.#theatre = props.theatre;

    const definition = this.airdromeDefinition;

    for (const stand of Object.values(definition.standlist)) {
      if (stand.blocked) {
        continue;
      }

      this.#stands.push({
        ...stand,
        inUse: [],
      });
    }
  }

  get airdromeDefinition() {
    const definition =
      Data.Theatres[this.#theatre].airdromeDefinitions[this.#name];

    if (definition == null) {
      throw new Error(`airdrome ${this.#name} not found`);
    }

    return definition;
  }

  public reserveStand(isHelicopter: boolean, from: number, to: number) {
    const usableStands = isHelicopter
      ? this.#stands.filter((stand) => stand.helicopter)
      : this.#stands;

    let availableStands = usableStands.filter(
      (stand) => stand.inUse.length === 0
    );

    if (availableStands.length === 0) {
      availableStands = usableStands
        .filter((stand) => {
          for (const inUse of stand.inUse) {
            if (inUse.from <= from && inUse.to >= to) {
              return false;
            }
          }

          return true;
        })
        .sort((a, b) => Number(a.id) - Number(b.id));
    }

    const selectedStand = availableStands[0];

    if (selectedStand == null) {
      throw new Error("No available stands");
    }

    selectedStand.inUse.push({ from, to });

    return selectedStand;
  }
}
