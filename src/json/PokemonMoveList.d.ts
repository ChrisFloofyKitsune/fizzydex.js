export interface PokemonMoveListEntryLevelUpMove {
  Name: string;
  Level: number;
  Note?: string;
}

export interface PokemonMoveListEntryMove {
  Name: string;
  Forms: string[];
}

interface PokemonMoveListEntryLevelUpMoveList {
  Form: string;
  LevelUpMoveMoves: PokemonMoveListEntryLevelUpMove[];
}

export interface PokemonMoveListEntry {
  Name: string;
  DexNum: number;
  DefaultForm: string;
  AltForms: string[];
  LevelUpMoveLists: PokemonMoveListEntryLevelUpMoveList[];
  EggMoves: PokemonMoveListEntryMove[];
  TutorMoves: PokemonMoveListEntryMove[];
  MachineMoves: PokemonMoveListEntryMove[];
  OtherGenerationTutorMoves?: PokemonMoveListEntryMove[];
  OtherGenerationMachineMoves?: PokemonMoveListEntryMove[];
}

export declare type PokemonMoveList = PokemonMoveListEntry[];
