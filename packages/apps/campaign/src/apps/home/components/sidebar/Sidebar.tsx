import * as DcsJs from "@foxdelta2/dcsjs";
import * as Components from "@kilcekru/dcc-lib-components";
import { createSignal, For, Show, useContext } from "solid-js";

import { Button, CampaignContext } from "../../../../components";
import { getFlightGroups, sortAsc } from "../../../../utils";
import { AircraftItem } from "./AircraftItem";
import { FlightGroupItem } from "./FlightGroupItem";
import style from "./Sidebar.module.less";

export const Sidebar = () => {
	const [state] = useContext(CampaignContext);
	const [selectedFaction, setSelectedFaction] = createSignal<DcsJs.CampaignFaction | undefined>(state.blueFaction);
	const [selectedListType, setSelectedListType] = createSignal<"flightGroups" | "aircrafts">("flightGroups");

	return (
		<div class={style.sidebar}>
			<div>
				<Button onPress={() => setSelectedFaction(state.blueFaction)}>Blue</Button>
				<Button onPress={() => setSelectedFaction(state.redFaction)}>Red</Button>
				<Button onPress={() => setSelectedListType("flightGroups")}>Flight Groups</Button>
				<Button onPress={() => setSelectedListType("aircrafts")}>Aircrafts</Button>
			</div>
			<Show when={selectedListType() === "flightGroups"}>
				<Components.ScrollContainer>
					<Components.List class={style.sidebar__list}>
						<For
							each={getFlightGroups(selectedFaction()?.packages ?? []).sort((a, b) =>
								sortAsc(a, b, (o) => o.startTime)
							)}
						>
							{(fg) => <FlightGroupItem flightGroup={fg} faction={selectedFaction()} />}
						</For>
					</Components.List>
				</Components.ScrollContainer>
			</Show>
			<Show when={selectedListType() === "aircrafts"}>
				<Components.List>
					<For each={Object.values(selectedFaction()?.inventory.aircrafts ?? [])}>
						{(ac) => <AircraftItem aircraft={ac} faction={selectedFaction()} />}
					</For>
				</Components.List>
			</Show>
		</div>
	);
};
