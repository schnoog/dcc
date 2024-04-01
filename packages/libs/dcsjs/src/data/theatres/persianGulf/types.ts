import * as z from "zod";

export namespace Schema {
  export const airdromeName = z.enum([
    "Abu Musa Island",
    "Bandar Abbas Intl",
    "Bandar Lengeh",
    "Al Dhafra AFB",
    "Dubai Intl",
    "Al Maktoum Intl",
    "Fujairah Intl",
    "Tunb Island AFB",
    "Havadarya",
    "Khasab",
    "Lar",
    "Al Minhad AFB",
    "Qeshm Island",
    "Sharjah Intl",
    "Sirri Island",
    "Tunb Kochak",
    "Sir Abu Nuayr",
    "Kerman",
    "Shiraz Intl",
    "Sas Al Nakheel",
    "Bandar-e-Jask",
    "Abu Dhabi Intl",
    "Al-Bateen",
    "Kish Intl",
    "Al Ain Intl",
    "Lavan Island",
    "Jiroft",
    "Ras Al Khaimah Intl",
    "Liwa AFB",
  ]);
}
export type AirdromeName = z.infer<typeof Schema.airdromeName>;
