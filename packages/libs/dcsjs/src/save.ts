import * as Path from "node:path";

import AdmZip from "adm-zip";

import Logo from "./assets/DCC_Logo_1024.png";
import { Mission } from "./class";
import Dictionary from "./template/l10n/DEFAULT/dictionary.template";
import Json from "./template/l10n/DEFAULT/json.lua";
import MapResource from "./template/l10n/DEFAULT/mapResource.template";
import Mist from "./template/l10n/DEFAULT/mist_4_5_122.lua";
import State from "./template/l10n/DEFAULT/state.lua";
import Options from "./template/options.template";

export async function save(mission: Mission, path?: string) {
	if (path != null && path.endsWith(".miz") === false) {
		throw new Error("invalid path");
	}

	// eslint-disable-next-line no-console
	console.log("💾 saving mission...");

	const zip = new AdmZip();

	zip.addFile("l10n/DEFAULT/dictionary", Buffer.from(Dictionary));
	zip.addFile("l10n/DEFAULT/mapResource", Buffer.from(MapResource));
	zip.addFile("l10n/DEFAULT/mist_4_5_122.lua", Buffer.from(Mist));
	zip.addFile("l10n/DEFAULT/json.lua", Buffer.from(Json));
	zip.addFile("l10n/DEFAULT/mission-config.lua", Buffer.from("config = " + mission.toMissionConfig(), "utf-8"));
	zip.addFile("l10n/DEFAULT/state.lua", Buffer.from(State));
	zip.addFile("mission", Buffer.from("mission = " + mission.toMissionLuaTable(), "utf-8"));
	zip.addFile("options", Buffer.from(Options));
	zip.addFile("theatre", Buffer.from(mission.theatre));
	zip.addFile("warehouses", Buffer.from("warehouses = " + mission.toWarehouseLuaTable(), "utf-8"));

	zip.addLocalFile(Path.join(__dirname, Logo), "l10n/DEFAULT", "DCC_Logo_1024.png");

	if (path) {
		zip.writeZip(path);

		// eslint-disable-next-line no-console
		console.log("🚀 mission saved to", path);
		return;
	}

	return zip.toBuffer();
}
