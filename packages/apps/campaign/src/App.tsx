import * as DcsJs from "@foxdelta2/dcsjs";
import * as Components from "@kilcekru/dcc-lib-components";
import { onEvent, rpc } from "@kilcekru/dcc-lib-rpc";
import type * as Types from "@kilcekru/dcc-shared-types";
import { createEffect, createSignal, Match, onCleanup, onMount, Show, Switch, useContext } from "solid-js";
import { unwrap } from "solid-js/store";

import { CreateCampaign, Home, Open } from "./apps";
import { CampaignContext, CampaignProvider } from "./components";
import { DataProvider } from "./components/DataProvider";
import { ModalProvider, useSetIsPersistanceModalOpen } from "./components/modalProvider";
import { PersistenceModal } from "./components/persistance-modal";
import { Config } from "./data";
import { useSave } from "./hooks";
import { onWorkerEvent, sendWorkerMessage } from "./worker";

const App = (props: { open: boolean }) => {
	const setIsPersistanceModalOpen = useSetIsPersistanceModalOpen();
	const [state, { closeCampaign }] = useContext(CampaignContext);
	const save = useSave();
	const [open, setOpen] = createSignal(false);
	let workerSubscription: { dispose: () => void } | undefined;

	createEffect(() => setOpen(props.open));

	onEvent("menu.dev.logState", () => {
		console.log(unwrap(state)); // eslint-disable-line no-console
	});

	onEvent("menu.campaign.new", () => {
		setOpen(false);
		closeCampaign?.();
		save();
	});

	onEvent("menu.campaign.open", () => {
		setOpen(true);
		closeCampaign?.();
		save();
	});

	onEvent("menu.campaign.persistance", () => {
		setIsPersistanceModalOpen(true);
	});

	async function saveCampaign(state: Types.Campaign.WorkerState) {
		await rpc.campaign
			.saveCampaign(state)
			// eslint-disable-next-line no-console
			.catch((e) => console.error(e instanceof Error ? e.message : "unknown error"));
	}

	onMount(function onMount() {
		workerSubscription = onWorkerEvent("serialized", async (event: Types.Campaign.WorkerEventSerialized) => {
			void saveCampaign(event.state);
		});
	});

	onCleanup(() => {
		workerSubscription?.dispose();
	});

	function onOpenCreateCampaign() {
		setOpen(false);
	}

	return (
		<>
			<Show when={state.loaded} fallback={<div>Loading Campaigns...</div>}>
				<Switch fallback={<div>Not Found</div>}>
					<Match when={state.active === true}>
						<Home />
					</Match>
					<Match when={state.active === false}>
						<Switch fallback={<div>Not Found</div>}>
							<Match when={open()}>
								<Open onOpenCreateCampaign={onOpenCreateCampaign} />
							</Match>
							<Match when={!open()}>
								<CreateCampaign />
							</Match>
						</Switch>
					</Match>
				</Switch>
			</Show>
			<PersistenceModal />
		</>
	);
};

const AppWithContext = () => {
	const [campaignState, setCampaignState] = createSignal<Partial<DcsJs.CampaignState> | null | undefined>(undefined);
	const [open, setOpen] = createSignal(false);

	onMount(async () => {
		setCampaignState({
			loaded: true,
		});
		rpc.campaign
			.resumeCampaign(Config.campaignVersion)
			.then((loadedState) => {
				console.log("load", loadedState); // eslint-disable-line no-console

				if (loadedState == null) {
					setCampaignState({
						loaded: true,
					});

					if (loadedState === undefined) {
						setOpen(true);
					}

					return;
				}

				sendWorkerMessage({
					name: "load",
					state: loadedState,
				});

				setCampaignState({
					active: true,
					loaded: true,
				});

				// setOpen(false);

				/* if (loadedState.map != null) {
					setDataMap(loadedState.map);
				}

				setCampaignState({
					...migrateState(loadedState, dataStore),
					loaded: true,
				});

				setOpen(false); */
			})
			.catch((e) => {
				console.error("RPC Load", e instanceof Error ? e.message : "unknown error"); // eslint-disable-line no-console
				setCampaignState({
					loaded: true,
				});
			});
	});

	return (
		<Show when={campaignState !== undefined} fallback={<div>Loading...</div>}>
			<CampaignProvider campaignState={campaignState()}>
				<App open={open()} />
			</CampaignProvider>
		</Show>
	);
};

const AppWithData = () => {
	return (
		<Components.ToastProvider>
			<DataProvider>
				<ModalProvider>
					<AppWithContext />
				</ModalProvider>
			</DataProvider>
		</Components.ToastProvider>
	);
};

export { AppWithData as App };
