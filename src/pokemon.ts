import type { PokemonInfoEntry } from "./json/PokemonInfoList";
import { Form } from "./form";
import { GetPokemon } from "./fizzyDex";
import { EvolutionChain } from "./evolutionChain";
import { FormChange } from "./formChange";

export type EvolutionFamilyEntry = {
  Pokemon: Pokemon;
  Form: string;
  Method?: string;
  EvolvesFrom?: EvolutionFamilyEntry;
};

export class Pokemon implements Omit<PokemonInfoEntry, "Forms"> {
  Name: string;
  DexNum: number;

  Forms: Form[];
  DefaultFormName: string;
  MoveSetNames: string[];

  EvolutionChains: EvolutionChain[];
  FormChanges: FormChange[];

  GenderRatioF: number;
  GenderRatioM: number;
  EggGroups: string[];

  constructor(dataObject: PokemonInfoEntry | Pokemon) {
    this.Name = dataObject.Name;
    this.DexNum = dataObject.DexNum;
    this.DefaultFormName = dataObject.DefaultFormName;

    this.Forms = [];
    for (const form of dataObject.Forms) {
      this.Forms.push(new Form(this, form));
    }

    this.EvolutionChains = [];
    if (dataObject.EvolutionChains) {
      for (const evolutionChain of dataObject.EvolutionChains) {
        this.EvolutionChains.push(Object.assign({}, evolutionChain));
      }
    }

    this.FormChanges = [];
    if (dataObject.FormChanges) {
      for (const formChange of dataObject.FormChanges) {
        this.FormChanges.push(Object.assign({}, formChange));
      }
    }

    this.MoveSetNames = [];
    if (!!(dataObject as Pokemon).MoveSetNames) {
      this.MoveSetNames.push(...(dataObject as Pokemon).MoveSetNames);
    } else {
      for (const moveSet of this.Forms.filter((f) => !!f.MoveSet).map(
        (f) => f.MoveSet
      )) {
        if (!this.MoveSetNames.some((m) => m === moveSet)) {
          this.MoveSetNames.push(moveSet!);
        }
      }
    }

    this.GenderRatioM = dataObject.GenderRatioM ?? 0;
    this.GenderRatioF = dataObject.GenderRatioF ?? 0;
    this.EggGroups = dataObject.EggGroups
      ? Array.from(dataObject.EggGroups)
      : ["EGG GROUP INFO MISSING"];
  }

  FixFormName(formName: string | null = null) {
    if (!formName) {
      return this.DefaultFormName;
    }

    formName = formName.trim();
    const match = this.Forms.find(
      (f) => f.FormName.toLowerCase() === formName!.toLowerCase()
    );
    return match?.FormName ?? this.DefaultFormName;
  }

  GetForm(formName: string | null = null) {
    formName = this.FixFormName(formName);
    return this.Forms.find((f) => f.FormName === formName);
  }

  GetPokemonInEvolutionFamily(
    formName: string | null = null
  ): EvolutionFamilyEntry[] {
    if (formName !== null && formName.toLowerCase() === "any") {
      formName = "Any";
    } else {
      formName = this.FixFormName(formName);
    }

    const defaultResult = [
      {
        Pokemon: this,
        Form: formName === "Any" ? this.DefaultFormName : formName,
      },
    ];

    if (this.EvolutionChains.length === 0) {
      return defaultResult;
    }

    let evoChains = this.EvolutionChains.filter(
      (ec) =>
        formName === "Any" ||
        (ec.Stage1DexNum === this.DexNum && ec.Stage1Form === formName) ||
        (ec.Stage2DexNum === this.DexNum && ec.Stage2Form === formName) ||
        (ec.Stage3DexNum === this.DexNum && ec.Stage3Form === formName)
    );

    if (evoChains.length == 0) {
      return defaultResult;
    }

    // Find any branches that this current pokemon's form is related to.
    const allEvoChains = [...evoChains];

    // Start from stage 1 and go outwards
    evoChains.forEach((ec) => {
      let moreEvoChains = GetPokemon(ec.Stage1DexNum).EvolutionChains.filter(
        (mec) =>
          mec.Stage1Form === ec.Stage1Form ||
          formName === "Any" ||
          ec.Stage1Form === "Any" ||
          mec.Stage1Form === "Any"
      );
      if (moreEvoChains.length !== 0) {
        allEvoChains.push(
          ...moreEvoChains.filter(
            (mec) =>
              !allEvoChains.some(
                (aec) =>
                  aec.Stage1DexNum === mec.Stage1DexNum &&
                  aec.Stage1Form === mec.Stage1Form &&
                  aec.Stage2DexNum === mec.Stage2DexNum &&
                  aec.Stage2Form === mec.Stage2Form &&
                  aec.Stage3DexNum === mec.Stage3DexNum &&
                  aec.Stage3Form === mec.Stage3Form
              )
          )
        );
      }
    });

    const result: EvolutionFamilyEntry[] = [];

    for (const ec of allEvoChains) {
      let stage1Mon = result.find(
        (item) =>
          item.Pokemon.DexNum === ec.Stage1DexNum && item.Form === ec.Stage1Form
      );
      let stage2Mon = result.find(
        (item) =>
          item.Pokemon.DexNum === ec.Stage2DexNum && item.Form === ec.Stage2Form
      );

      if (!stage1Mon) {
        stage1Mon = {
          Pokemon: GetPokemon(ec.Stage1DexNum),
          Form: ec.Stage1Form,
        };
        result.push(stage1Mon);
      }

      if (!stage2Mon) {
        stage2Mon = {
          Pokemon: GetPokemon(ec.Stage2DexNum),
          Form: ec.Stage2Form,
          Method: ec.Stage2Method,
          EvolvesFrom: stage1Mon,
        };
        result.push(stage2Mon);
      }

      if (
        !!ec.Stage3DexNum &&
        !!ec.Stage3Form &&
        !!ec.Stage3Method &&
        !result.some(
          (item) =>
            item.Pokemon.DexNum === ec.Stage3DexNum &&
            item.Form === ec.Stage3Form
        )
      ) {
        result.push({
          Pokemon: GetPokemon(ec.Stage3DexNum),
          Form: ec.Stage3Form,
          Method: ec.Stage3Method,
          EvolvesFrom: stage2Mon,
        });
      }
    }

    return result;
  }
}
