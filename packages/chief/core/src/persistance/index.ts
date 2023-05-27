import { UserConfig } from "@kilcekru/dcc-shared-rpc-types";
import { app, Rectangle } from "electron";

import { Persistance } from "./persistance";

export const dccState = new Persistance<DccState>({ path: "dcc/state" });
export const userConfig = new Persistance<UserConfig>({
	path: "dcc/userConfig",
	default: { downloadsPath: app.getPath("downloads") },
});

interface DccState {
	win: {
		bounds?: Rectangle;
		maximized?: boolean;
	};
}
