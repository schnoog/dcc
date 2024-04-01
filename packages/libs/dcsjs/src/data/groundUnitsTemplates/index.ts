import { GroundUnitsTemplate } from "../types";
import { FranceModern } from "./france-modern";
import { RussiaColdWar } from "./russia-cold-war";
import { RussiaKoreaWar } from "./russia-korea-war";
import { RussiaModern } from "./russia-modern";
import { UsaColdWar } from "./usa-cold-war";
import { UsaKoreaWar } from "./usa-korea-war";
import { UsaModern } from "./usa-mordern";

export const groundUnitsTemplates: GroundUnitsTemplate[] = [
  UsaModern,
  RussiaModern,
  FranceModern,
  UsaColdWar,
  RussiaColdWar,
  UsaKoreaWar,
  RussiaKoreaWar,
];
