import { Data } from "./data";
import { Defaults } from "./defaults";
import { GetPokemon, GetMoveInfo, GetAbilityInfo } from "./fizzyDex";
import { PokemonMoveList } from "./json/PokemonMoveList";
import { PokemonInfoList } from "./json/PokemonInfoList";
import { MoveDex } from "./json/moveDex";
import { AbilityDex } from "./json/abilityDex";

function DownloadJson(fileURI: string) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.onload = function () {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300)
        resolve(JSON.parse(xhr.responseText));
      else reject(Error(xhr.statusText));
    };

    xhr.open("GET", fileURI, true);
    xhr.send();
  });
}

function DownloadPokemonInfoList(fileURI: string) {
  return DownloadJson(fileURI).then((data) => {
    Data.PokemonList = data as PokemonInfoList;
  });
}

function DownloadPokemonMoveList(fileURI: string) {
  return DownloadJson(fileURI).then((data) => {
    Data.PokemonMoveList = (data as any).Pokemon as PokemonMoveList;
  });
}

function DownloadMoveDex(fileURI: string) {
  return DownloadJson(fileURI).then((data) => {
    Data.MoveDex = data as MoveDex;
  });
}

function DownloadAbilityDex(fileURI: string) {
  return DownloadJson(fileURI).then((data) => {
    Data.AbilityDex = data as AbilityDex;
  });
}

export const FizzyDex = {
  Data,
  Defaults,
  DownloadPokemonInfoList,
  DownloadPokemonMoveList,
  DownloadMoveDex,
  DownloadAbilityDex,
  GetPokemon,
  GetMoveInfo,
  GetAbilityInfo,
};
export default FizzyDex;

export { LevelUpMove, Move } from "./moveList";
export { TypeWeaknesses } from "./typeWeaknesses";
export { Form } from "./form";
export { Pokemon } from "./pokemon";
