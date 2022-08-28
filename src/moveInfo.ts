import { MoveDex } from "./json/moveDex";
import { Data } from "./data";
import { PokemonType } from "./pokemonType";

export class MoveInfo {
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
  MaxMove: string | null;
  MaxMovePower: number | null;
  ZMove: string | null;
  ZMovePowerOrEffect: string | null;

  constructor(dataObject: MoveDex[number]) {
    this.Name = dataObject.Name;
    this.Type = dataObject.Type;
    this.Category = dataObject.Category;
    this.BasePower = dataObject.BasePower;
    this.Accuracy = dataObject.Accuracy;
    this.BattleEffect = dataObject.BattleEffect;
    this.SecondaryEffect = dataObject.SecondaryEffect;
    this.EffectRate = dataObject.EffectRate;
    this.SpeedPriority = dataObject.SpeedPriority;
    this.CriticalHitRate = dataObject.CriticalHitRate;
    this.Target = dataObject.Target;
    this.MakesPhysicalContact = dataObject.MakesPhysicalContact;

    this.IsSuperMove = dataObject.IsSuperMove;
    this.MaxMove = (dataObject.IsSuperMove === "No") ? Data.DefaultMaxMoves[this.Category === "Status" ? this.Category : this.Type] : null;
    this.MaxMovePower = (dataObject.IsSuperMove === "Yes" || this.Category === "Status") ? 0 : dataObject.MaxMovePower!;
    this.ZMove = (dataObject.IsSuperMove === "No") ? (this.Category === "Status" ? `Z-${this.Name}` : Data.DefaultZMoves[this.Type]) : null;
    this.ZMovePowerOrEffect = (dataObject.IsSuperMove === "No") ? dataObject.ZMovePowerOrEffect! : null;
  }
}