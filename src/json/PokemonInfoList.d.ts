export interface PokemonInfoEntryForm {
  FormName: string;
  PrimaryType: string;
  SecondaryType?: string;
  Ability1: string;
  Ability2?: string;
  HiddenAbility?: string;
  ExtraMove?: string;
  SignatureSuperMove?: string;
  IsSuperForm?: boolean;
  HumpySpriteCode?: string;
  HumpySpriteURL?: string;
  HumpyShinyURL?: string;
  ArtworkURL?: string;
  MoveSet?: string;
}

export interface PokemonInfoEntryEvolutionChain {
  Stage1DexNum: number;
  Stage1Form: string;
  Stage2Method: string;
  Stage2DexNum: number;
  Stage2Form: string;
  Stage3Method?: string;
  Stage3DexNum?: number;
  Stage3Form?: string;
}

export interface PokemonInfoEntryFormChange {
  StartForm: string;
  ChangeMethod: string;
  EndForm: string;
}

export interface PokemonInfoEntry {
  Name: string;
  DexNum: number;
  Forms: PokemonInfoEntryForm[];
  DefaultFormName: string;
  GenderRatioM: number;
  GenderRatioF: number;
  EggGroups: string[];
  EvolutionChains?: PokemonInfoEntryEvolutionChain[];
  FormChanges?: PokemonInfoEntryFormChange[];
}

export declare type PokemonInfoList = PokemonInfoEntry[];
