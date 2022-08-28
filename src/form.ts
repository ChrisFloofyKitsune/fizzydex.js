import type { PokemonInfoEntryForm } from "./json/PokemonInfoList";
import { Pokemon } from "./pokemon";
import { Defaults } from "./defaults";
import { TypeWeaknesses } from "./typeWeaknesses";
import { PokemonType } from "./pokemonType";
import { MoveList } from "./moveList";

export class Form implements PokemonInfoEntryForm {
  public Pokemon: Pokemon;
  public FormName: string;
  public PrimaryType: PokemonType;
  public SecondaryType?: PokemonType;

  public Ability1: string;
  public Ability2?: string;
  public HiddenAbility?: string;

  public MoveSet?: string;
  public ExtraMove?: string;
  public SignatureSuperMove?: string;

  public HumpySpriteURL: string;
  public HumpyShinyURL: string;
  public ArtworkURL: string;

  public IsSuperForm: boolean;

  public TypeWeaknesses: TypeWeaknesses;

  private cachedMoveList: MoveList | null = null;

  public constructor(parent: Pokemon, dataObject: PokemonInfoEntryForm | Form) {
    this.Pokemon = parent;

    this.FormName = dataObject.FormName;
    this.PrimaryType = dataObject.PrimaryType as PokemonType;
    this.SecondaryType = dataObject.SecondaryType as PokemonType;

    this.Ability1 = dataObject.Ability1;
    this.Ability2 = dataObject.Ability2;
    this.HiddenAbility = dataObject.HiddenAbility;

    this.MoveSet = dataObject.MoveSet;
    this.ExtraMove = dataObject.ExtraMove;
    this.SignatureSuperMove = dataObject.SignatureSuperMove;

    this.IsSuperForm = !!dataObject.IsSuperForm;

    this.TypeWeaknesses =
      (dataObject as Form).TypeWeaknesses ??
      new TypeWeaknesses(this.PrimaryType, this.SecondaryType);

    if (dataObject.HumpySpriteURL) {
      this.HumpySpriteURL = dataObject.HumpySpriteURL!;
      this.HumpyShinyURL = dataObject.HumpyShinyURL!;
    } else {
      let humpyCode: string;

      if ((dataObject as PokemonInfoEntryForm).HumpySpriteCode) {
        humpyCode = (dataObject as PokemonInfoEntryForm).HumpySpriteCode!;
      } else {
        let dexNumText = this.Pokemon.DexNum.toString().padStart(3, "0");
        if (this.FormName === this.Pokemon.DefaultFormName) {
          humpyCode = dexNumText;
        } else {
          humpyCode =
            dexNumText +
            (this.FormName === "Gigantamax"
              ? "gx"
              : this.FormName.charAt(0).toLowerCase());
        }
      }

      this.HumpySpriteURL = `${Defaults.DefaultHumpySpriteSource}${humpyCode}.gif`;
      this.HumpyShinyURL = `${Defaults.DefaultHumpyShinySource}${humpyCode}.gif`;
    }

    if (dataObject.ArtworkURL) {
      this.ArtworkURL = dataObject.ArtworkURL;
    } else {
      let artCode: string;
      let dexNumText = this.Pokemon.DexNum.toString();

      if (this.FormName === this.Pokemon.DefaultFormName) {
        artCode = dexNumText;
      } else {
        artCode =
          dexNumText +
          "-" +
          (this.FormName === "Gigantamax"
            ? "gx"
            : this.FormName.charAt(0).toLowerCase());
      }
      this.ArtworkURL = `${Defaults.DefaultArtworkURLSource}${artCode}.png`;
    }
  }

  public GetMoves() {
    if (!!this.cachedMoveList) {
      return this.cachedMoveList;
    }

    this.cachedMoveList = new MoveList(this);
    return this.cachedMoveList;
  }
}
