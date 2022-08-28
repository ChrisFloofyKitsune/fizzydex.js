import { Data } from "./data";
import { PokemonType } from "./pokemonType";

export class TypeWeaknesses {
  Normal = 1;
  Fire = 1;
  Water = 1;
  Electric = 1;
  Grass = 1;
  Ice = 1;
  Fighting = 1;
  Poison = 1;
  Ground = 1;
  Flying = 1;
  Psychic = 1;
  Bug = 1;
  Rock = 1;
  Ghost = 1;
  Dragon = 1;
  Dark = 1;
  Steel = 1;
  Fairy = 1;

  constructor(primaryType: PokemonType, secondaryType?: PokemonType) {
    for (const type of Data.TypeData.Types) {
      this[type as keyof TypeWeaknesses] = Data.TypeData.Weaknesses[primaryType][type] *
        (!secondaryType ? 1 : Data.TypeData.Weaknesses[secondaryType][type]);
    }
  }
}