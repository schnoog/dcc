import * as luaTable from "@kilcekru/lua-table";
import AdmZip from "adm-zip";
import * as fs from "fs-extra";
import path from "path";

import { GeneratedTypes, Objective, Target, targetType } from "../data";

const targetPath = "./dist/parse";

// eslint-disable-next-line no-console
console.log("🍵 start");

const missionPath = process.argv[2];

const withObjectives = process.argv[3] === "objectives";
const withTargets = process.argv[3] === "targets";
const withSchema =
  process.argv[3] === "schema" || withObjectives || withTargets;

if (missionPath == null) {
  throw new Error("Missing mission path");
}

const missionName = path.basename(missionPath).split(".")[0];

if (missionName == null) {
  throw new Error("Missing mission name");
}

const zip = new AdmZip(missionPath);

const entry = zip.getEntry("mission");

if (entry == null) {
  throw new Error("Invalid mission file");
}

const luaString = entry.getData().toString("utf-8");

fs.emptyDirSync(targetPath);
fs.writeFileSync(path.join(targetPath, missionName), luaString);

const parsedMission = luaTable.parse(luaString.slice(9), {
  mixedKeyTypes: true,
});

fs.writeFileSync(
  path.join(targetPath, missionName + ".json"),
  JSON.stringify(parsedMission)
);

if (withSchema) {
  const parsedSchema = GeneratedTypes.Schema.mission.safeParse(parsedMission);

  if (parsedSchema.success) {
    // eslint-disable-next-line no-console
    console.log("😊 schema is valid");
    const objectives: Objective[] = [];

    if (withObjectives || withTargets) {
      if (Array.isArray(parsedSchema.data.triggers.zones)) {
        for (const zone of parsedSchema.data.triggers.zones) {
          const zoned = GeneratedTypes.Schema.triggerZone.parse(zone);
          const nameSplit = zoned.name.split("|");

          const objective: Objective = {
            name: nameSplit[1] ?? "",
            position: { x: zoned.x, y: zoned.y },
            type: nameSplit[0] ?? "",
          };

          objectives.push(objective);
        }

        if (withObjectives) {
          fs.writeFileSync(
            path.join(targetPath, "objectives.json"),
            JSON.stringify(objectives)
          );

          // eslint-disable-next-line no-console
          console.log("😊 Objectives generated");
        }
      } else {
        // eslint-disable-next-line no-console
        console.log("😢 no objectives fount");
      }
    }

    if (withTargets) {
      if (Array.isArray(parsedSchema.data.coalition.red?.country)) {
        const country = parsedSchema.data.coalition.red?.country.find(
          (country: unknown) => {
            const parsed = GeneratedTypes.Schema.country.parse(country);

            return parsed.id === 0;
          }
        ) as GeneratedTypes.Country | undefined;

        if (country == null) {
          // eslint-disable-next-line no-console
          console.log("😢 russia not found");

          throw new Error("Russia not found");
        }

        const targets: Record<string, Target[]> = {};

        if (Array.isArray(country.static?.group)) {
          for (const group of country.static?.group ?? []) {
            const parsed = GeneratedTypes.Schema.staticGroup.parse(group);
            const nameSplit = parsed.name.split("|");

            if (nameSplit[1] === undefined) {
              throw new Error("Invalid static group name: " + parsed.name);
            }
            const objectiveName = nameSplit[0];
            const type = targetType.parse(nameSplit[1]);
            const groupId = nameSplit[2];

            if (
              objectiveName == null ||
              objectives.some((o) => o.name === objectiveName) === false
            ) {
              throw new Error(`Objective not found: ${parsed.name}`);
            }

            if (groupId == null || Number.isNaN(Number(groupId))) {
              throw new Error(`Group Id not found: ${parsed.name}`);
            }

            const target: Target = {
              name: parsed.name,
              position: { x: parsed.x, y: parsed.y },
              type,
              groupId: Number(groupId),
              objectiveName,
              unitPositions: parsed.units.map((unit) => ({
                x: unit.x,
                y: unit.y,
                heading: unit.heading,
              })),
            };

            targets[target.objectiveName] = [
              ...(targets[target.objectiveName] ?? []),
              target,
            ];
          }
        }

        if (Array.isArray(country.vehicle?.group)) {
          for (const group of country.vehicle?.group ?? []) {
            const parsed = GeneratedTypes.Schema.groundGroup.parse(group);
            const nameSplit = parsed.name.split("|");

            if (nameSplit[1] === undefined) {
              throw new Error("Invalid static group name: " + parsed.name);
            }
            const objectiveName = nameSplit[0];
            const type = targetType.parse(nameSplit[1]);
            const groupId = nameSplit[2];

            if (
              objectiveName == null ||
              objectives.some((o) => o.name === objectiveName) === false
            ) {
              throw new Error(`Objective not found: ${parsed.name}`);
            }

            if (groupId == null || Number.isNaN(Number(groupId))) {
              throw new Error(`Group Id not found: ${parsed.name}`);
            }

            const target: Target = {
              name: parsed.name,
              position: { x: parsed.x, y: parsed.y },
              type,
              groupId: Number(groupId),
              objectiveName,
              unitPositions: parsed.units.map((unit) => ({
                x: unit.x,
                y: unit.y,
                heading: unit.heading,
              })),
            };

            targets[target.objectiveName] = [
              ...(targets[target.objectiveName] ?? []),
              target,
            ];
          }
        }

        fs.writeFileSync(
          path.join(targetPath, "targets.json"),
          JSON.stringify(targets)
        );

        // eslint-disable-next-line no-console
        console.log("😊 targets generated");
      }
    }
  } else {
    // eslint-disable-next-line no-console
    console.log("😢 schema is invalid");
    // eslint-disable-next-line no-console
    console.log(parsedSchema.error);
  }
} else {
  // eslint-disable-next-line no-console
  console.log("🤷 skip schema validation");
}

// eslint-disable-next-line no-console
console.log("👌 done");
