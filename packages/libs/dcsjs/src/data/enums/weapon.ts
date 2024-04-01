import * as z from "zod";

export const a2aWeaponType = z.enum([
  "infrared",
  "active radar",
  "semi-active radar",
]);
export type A2AWeaponType = z.TypeOf<typeof a2aWeaponType>;

export const a2gWeaponType = z.enum([
  "Bomb",
  "Cluster",
  "Rocket",
  "Laser Guided Bomb",
  "GPS Guided Bomb",
  "TV Guided Bomb",
  "Laser Guided Rocket",
]);
export type A2GWeaponType = z.TypeOf<typeof a2gWeaponType>;

export const a2gRangeWeaponType = z.enum([
  "Missile",
  "Glide Bomb",
  "Laser Guided Missile",
  "Cruise Missile",
]);
export type a2gRangeWeaponType = z.TypeOf<typeof a2gRangeWeaponType>;

export const rangeType = z.enum(["short", "medium", "long"]);
export type RangeType = z.TypeOf<typeof rangeType>;

export const a2gWeaponTarget = z.enum([
  "Anti-Armor",
  "Hard Target",
  "Medium Target",
  "Soft Target",
  "Ship",
  "Radar",
  "Light Structure",
  "Medium Structure",
  "Hard Structure",
]);
export type A2GWeaponTarget = z.TypeOf<typeof a2gWeaponTarget>;

export const weaponType = z.union([
  a2aWeaponType,
  a2gWeaponType,
  a2gRangeWeaponType,
]);
export type WeaponType = z.TypeOf<typeof weaponType>;
