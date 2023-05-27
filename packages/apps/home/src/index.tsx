import "./index.less";

import { Match, Switch } from "solid-js";
import { render } from "solid-js/web";

import { Launcher, OnBoarding, Settings } from "./pages";
import { StoreProvider, useSetAction, useStore } from "./store";

const App = () => {
	const state = useStore();
	const setAction = useSetAction();

	return (
		<>
			<Switch fallback={<Launcher onSettings={() => setAction("settings")} />}>
				<Match when={state.error != undefined}>
					<div>Render error: {state.error?.message}</div>
				</Match>
				<Match when={state.loading}>
					<div />
				</Match>
				<Match when={!state.userConfig?.setupComplete}>
					<OnBoarding />
				</Match>
				<Match when={state.userConfig?.dcs == undefined || state.action === "settings"}>
					<Settings />
				</Match>
			</Switch>
		</>
	);
};

const rootElement = document.getElementById("root");
if (rootElement != undefined) {
	render(
		() => (
			<StoreProvider>
				<App />
			</StoreProvider>
		),
		rootElement
	);
} else {
	console.error("Missing root element"); // eslint-disable-line no-console
}
