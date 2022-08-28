import TypeData from "./json/typeMatchUps.json";
import ZMoveData from "./json/zMoves.json";
import MaxMoveData from "./json/maxMoves.json";
import { PokemonInfoList } from "./json/PokemonInfoList";
import { PokemonMoveList } from "./json/PokemonMoveList";
import { MoveDex } from "./json/moveDex";
import { AbilityDex } from "./json/abilityDex";
import { PokemonType } from "./pokemonType";

//Fill in gaps in json assuming that if it's not listed, it's multiplier is just 1.
for (const key in TypeData.Weaknesses) {
  let typeWeaknessEntry = (
    TypeData.Weaknesses as Record<string, Record<string, number>>
  )[key];
  for (const typeEntry of TypeData.Types) {
    if (typeWeaknessEntry[typeEntry] === undefined)
      typeWeaknessEntry[typeEntry] = 1;
  }
}

export const Data: {
  PokemonList: PokemonInfoList | null;
  PokemonMoveList: PokemonMoveList | null;
  MoveDex: MoveDex | null;
  AbilityDex: AbilityDex | null;
  TypeData: {
    Types: PokemonType[];
    Weaknesses: Record<PokemonType, Record<PokemonType, number>>;
  };
  DefaultZMoves: Record<PokemonType, string>;
  SpeciesZMoveBaseMoves: Record<string, string>;
  DefaultMaxMoves: Record<PokemonType | "Status", string>;
  SpeciesGMaxMovesTypes: Record<string, PokemonType>;
} = {
  PokemonList: null,
  PokemonMoveList: null,
  MoveDex: null,
  AbilityDex: null,
  TypeData: TypeData as any,
  DefaultZMoves: ZMoveData.TypeDefaults,
  SpeciesZMoveBaseMoves: ZMoveData.SpeciesBaseMoves,
  DefaultMaxMoves: MaxMoveData.TypeDefaults,
  SpeciesGMaxMovesTypes: MaxMoveData.SpeciesGMaxMoveTypes as any,
};
