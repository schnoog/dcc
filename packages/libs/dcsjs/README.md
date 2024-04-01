# dcsjs

Mission Generator for DCS

# README is out of date

dcsjs currently works only with DCC.

- [Installation](#installation)
- [Usage](#usage)
  - [defineMission](#defineMission)
  - [generate](#generate)
- [License](#license)

## Installation

`npm install @foxdelta2/dcsjs`

## Usage

### defineMission

```javascript
import { Mission } from "@foxdelta2/dcsjs";

Mission.defineMission({
  missionType: "CAS",
  aircraft: "Ka-50",
  clients: 1,
  startType: "cold",
  useCarrier: false,
  useFARP: true,
  blueFaction: blueFaction,
  redFaction: redFaction,
});
```

### generate

```javascript
import { Mission } from "@foxdelta2/dcsjs";

Mission.generate("./Saved Games/DCS.openbeta/Missions");
```

### Add Theatre

1. Create a .miz file with the theatre and populate the mission with objectives and targets.
2. Create a folder in 'theatres' with the name.
3. run `pnpm parse '.miz. file' objectives`.
4. copy the content from `./dist/parse/objectives` into the objectives.ts in your theatre folder. (with the same definitions as the other theatres)
5. run `pnpm parse '.miz. file' targets`.
6. copy the content from `./dist/parse/targets` into the targets.ts in your theatre folder. (with the same definitions as the other theatres)
7. copy the content of the data-miner/me_map_window.lua into the me_map_window.lua in DCS World OpenBeta\MissionEditor\modules\me_map_window.lua at the beginning of the createAircraft function
   - The data will be exported when created a new aircraft in a Mission Editor(ME)

## License

Licensed under [MIT](https://github.com/rhyver/dcsjs/blob/main/LICENSE).
