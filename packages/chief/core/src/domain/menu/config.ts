import * as Types from "@kilcekru/dcc-shared-types";
import { BrowserWindow } from "electron";

import { config } from "../../config";
import * as Persistance from "../persistance";

export function getConfig(): Types.AppMenu.Config {
	const currentApp = Persistance.State.userConfig.data.currentApp;
	const disableNavigation =
		!Persistance.State.userConfig.data.setupComplete || Persistance.State.userConfig.data.dcs.available == undefined;

	const menu: Types.AppMenu.Menu[] = [
		{
			label: "DCC",
			submenu: [
				{
					label: "Launcher",
					action: "loadLauncher",
					disabled: disableNavigation,
				},
				{
					label: "Settings",
					action: "loadSettings",
					disabled: disableNavigation,
				},
				{ type: "separator" },
				{
					label: "Quit",
					action: "quit",
				},
			],
		},
		{
			label: "Dev",
			hidden: config.env !== "dev",
			submenu: [
				{
					label: "Reload (F5)",
					action: "dev_reload",
					hotkeys: ["F5"],
				},
				{
					label: "Force reload (Ctrl+R)",
					action: "dev_forceReload",
					hotkeys: ["Control+R"],
				},
				{
					label: "Dev Tools (F12)",
					action: "dev_openDevTools",
					hotkeys: ["F12"],
				},
				{ type: "separator" },
				{
					label: "Reset user settings",
					action: "dev_resetUserSettings",
				},
				{
					label: "Log Campaign State",
					action: "dev_logCampaignState",
				},
				{ type: "separator" },
				{
					label: "Capture Window",
					action: "dev_captureWindow",
				},
				{
					label: "Capture Test",
					action: "dev_captureTest",
				},
			],
		},
		{
			label: "?",
			submenu: [
				{
					label: "About",
					action: "loadAbout",
					disabled: disableNavigation,
				},
			],
		},
		{
			label: "Campaign",
			hidden: currentApp !== "campaign",
			submenu: [
				{
					label: "New Campaign",
					action: "campaign_new",
				},
				{
					label: "Open Campaign",
					action: "campaign_open",
				},
			],
		},
	];

	return {
		isMaximized: BrowserWindow.getFocusedWindow()?.isMaximized() ?? false,
		menu,
	};
}
