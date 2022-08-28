import { Data } from "./data";
import { Pokemon } from "./pokemon";
import { PokemonInfoEntry } from "./json/PokemonInfoList";
import { AbilityInfo } from "./abilityInfo";
import { MoveInfo } from "./moveInfo";
import { Form } from "./form";

const pokemonByDexNumCache = new Map<number, Pokemon>();
const pokemonByNameCache = new Map<string, Pokemon>();

export function GetPokemon(dexNumOrName: number | string): Pokemon {
  let _dexNumOrName = dexNumOrName.toString().trim();

  if (Data.PokemonList == null) {
    throw Error(
      "GetPokemon(): Data.PokemonList is uninitialized! Load it using LoadPokemonListJSON() or set it directly first!"
    );
  }

  let dexNum = parseInt(_dexNumOrName, 10);
  let pokemonData: PokemonInfoEntry | undefined;

  if (!isNaN(dexNum)) {
    if (dexNum <= 0 || dexNum > Data.PokemonList.length) {
      throw Error(
        `GetPokemon(): dexNum parameter "${_dexNumOrName}" is out of range! valid range is [1-${Data.PokemonList.length}]`
      );
    }

    if (pokemonByDexNumCache.has(dexNum)) {
      return pokemonByDexNumCache.get(dexNum)!;
    }

    pokemonData = Data.PokemonList[dexNum - 1];
  } else {
    pokemonData = Data.PokemonList.find(
      (p) => p.Name.toLowerCase() === _dexNumOrName.toLowerCase()
    );

    if (!pokemonData) {
      throw Error(
        `GetPokemon(): name parameter not found in the pokemon list! ${dexNumOrName}`
      );
    }

    if (pokemonByNameCache.has(pokemonData.Name)) {
      return pokemonByNameCache.get(pokemonData.Name)!;
    }
  }

  let result = new Pokemon(pokemonData);
  pokemonByDexNumCache.set(result.DexNum, result);
  pokemonByNameCache.set(result.Name, result);
  return result;
}

export function GetAbilityInfo(abilityName: string): AbilityInfo {
  if (Data.AbilityDex == null) {
    throw Error(
      "GetAbilityInfo(): Data.AbilityDex is uninitialized! Load it using LoadAbilityDexJSON() or set it directly first!"
    );
  }

  abilityName = abilityName.trim();
  let data = Data.AbilityDex.find(
    (a) => a.Name.toLowerCase() === abilityName.toLowerCase()
  );
  if (!data) {
    throw Error(
      `GetAbilityInfo(): Could not find an ability with the name "${abilityName}"!`
    );
  }
  return Object.assign({}, data);
}

export function GetMoveInfo(moveName: string, form: Form | null = null) {
  if (Data.MoveDex == null) {
    throw Error(
      "GetMoveInfo(): Data.MoveDex is uninitialized! Load it using LoadMoveDexJSON() or set it directly first!"
    );
  }

  let data = Data.MoveDex.find(
    (m) => m.Name.toLowerCase() === moveName.toLowerCase()
  );

  if (!data)
    throw Error(
      `GetMoveInfo(): Could not find a move with the name "${moveName}"!`
    );

  let moveInfo = new MoveInfo(data);

  if (
    moveInfo.IsSuperMove === "No" &&
    form !== null &&
    !!form.SignatureSuperMove
  ) {
    //GMax or ZMove?
    if (
      /G-Max/.test(form.SignatureSuperMove) &&
      moveInfo.Category !== "Status" &&
      moveInfo.Type === Data.SpeciesGMaxMovesTypes[form.SignatureSuperMove]
    ) {
      moveInfo.MaxMove = form.SignatureSuperMove;
      let gmaxInfo = GetMoveInfo(form.SignatureSuperMove, form);
      if (gmaxInfo.BasePower !== 1) {
        moveInfo.MaxMovePower = gmaxInfo.BasePower;
      }
    } else if (
      moveInfo.Name === Data.SpeciesZMoveBaseMoves[form.SignatureSuperMove]
    ) {
      moveInfo.ZMove = form.SignatureSuperMove;
      let zInfo = GetMoveInfo(form.SignatureSuperMove, form);
      moveInfo.ZMovePowerOrEffect = `${zInfo.BasePower}`;
    }
  }

  return moveInfo;
}
