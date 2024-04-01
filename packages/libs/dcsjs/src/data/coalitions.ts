import { countries } from "./countries";
import { Coalition } from "./enums";
import { Country } from "./types";

export const coalitionCountries: Record<Coalition, Country[]> = {
  blue: [
    countries["Australia"],
    countries["Austria"],
    countries["Belgium"],
    countries["Canada"],
    countries["Croatia"],
    countries["Czech Republic"],
    countries["Denmark"],
    countries["France"],
    countries["Georgia"],
    countries["Germany"],
    countries["Israel"],
    countries["Italy"],
    countries["Norway"],
    countries["Poland"],
    countries["South Korea"],
    countries["Spain"],
    countries["Sweden"],
    countries["The Netherlands"],
    countries["Turkey"],
    countries["USA"],
  ],
  red: [
    countries["Abkhazia"],
    countries["Belarus"],
    countries["China"],
    countries["Iran"],
    countries["Iraq"],
    countries["Kazakhstan"],
    countries["North Korea"],
    countries["Russia"],
    countries["Serbia"],
    countries["South Ossetia"],
    countries["Syria"],
    countries["Ukraine"],
  ],
  neutrals: [],
};

export const coalitions: Record<Coalition, number[]> = {
  blue: coalitionCountries.blue.map((country) => country.id),
  neutrals: [
    70, 83, 23, 65, 86, 64, 25, 63, 76, 90, 29, 62, 30, 78, 87, 31, 61, 32, 33,
    60, 17, 35, 69, 36, 59, 71, 79, 58, 57, 56, 55, 88, 73, 39, 89, 54, 77, 72,
    41, 42, 44, 85, 75, 53, 22, 52, 66, 51, 74, 82, 7, 68, 50, 49, 48, 67,
  ],
  red: coalitionCountries.red.map((country) => country.id),
};
