import { PokemonType } from "../pokemonType";

export declare type MoveDex = {
  Name: string;
  Type: PokemonType;
  Category: "Physical" | "Special" | "Status";
  BasePower: number;
  Accuracy: number;
  BattleEffect: string;
  SecondaryEffect: string;
  EffectRate: string;
  SpeedPriority: string;
  CriticalHitRate: string;
  Target: string;
  MakesPhysicalContact: "Yes" | "No";
  IsSuperMove: "Yes" | "No";
  MaxMovePower?: number;
  ZMovePowerOrEffect?: string;
}[];
