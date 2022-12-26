import { Form } from "./form";
import { MoveInfo } from "./moveInfo";
import { Data } from "./data";
import { GetMoveInfo } from "./fizzyDex";
import { PokemonType } from "./pokemonType";

let cachedDefaultMaxMoves: Record<PokemonType | "Status", Move> | null = null;

function GetDefaultMaxMoves() {
  if (cachedDefaultMaxMoves) return cachedDefaultMaxMoves;

  cachedDefaultMaxMoves = {} as Record<PokemonType | "Status", Move>;
  for (let type in Data.DefaultMaxMoves) {
    cachedDefaultMaxMoves[type as PokemonType | "Status"] = new Move(
      Data.DefaultMaxMoves[type as PokemonType | "Status"]
    );
  }
  return cachedDefaultMaxMoves;
}

let cachedDefaultZMoves: Record<PokemonType, Move> | null = null;

function GetDefaultZMoves() {
  if (cachedDefaultZMoves) return cachedDefaultZMoves;

  cachedDefaultZMoves = {} as Record<PokemonType, Move>;
  for (let type in Data.DefaultZMoves) {
    cachedDefaultZMoves[type as PokemonType] = new Move(
      Data.DefaultZMoves[type as PokemonType]
    );
  }
  return cachedDefaultZMoves;
}

export class Move {
  public Name: string;
  public Form: Form | null;

  private cachedMoveInfo: MoveInfo | null = null;

  public constructor(name: string, form: Form | null = null) {
    this.Name = name;
    this.Form = form;
  }

  public GetMoveInfo() {
    if (Data.MoveDex == null) {
      throw Error(
        "Move.GetMoveInfo(): Data.MoveDex is uninitialized! Load it using LoadMoveDexJSON() or set it directly first!"
      );
    }

    if (this.cachedMoveInfo) return this.cachedMoveInfo;

    this.cachedMoveInfo = GetMoveInfo(this.Name, this.Form);
    return this.cachedMoveInfo;
  }
}

export class LevelUpMove extends Move {
  public Level: number;

  constructor(name: string, level: number, form: Form | null = null) {
    super(name, form);
    this.Level = level;
  }
}

export class MoveList {
  public Form: Form;

  public LevelUpMoves: LevelUpMove[];
  public EggMoves: Move[];
  public TutorMoves: Move[];
  public MachineMoves: Move[];
  public ExtraMove: Move | null;
  public SignatureSuperMove: Move | null;

  // FB Specific
  public OtherGenerationTutorMoves: Move[];
  public OtherGenerationMachineMoves: Move[];

  private cachedUnfilteredMaxMoves: Record<
    PokemonType | "Status",
    Move
  > | null = null;
  private cachedUnfilteredZMoves: Record<PokemonType | string, Move> | null =
    null;
  private cachedMaxMoves: Move[] | null = null;
  private cachedZMoves: Move[] | null = null;

  public constructor(form: Form) {
    if (Data.PokemonMoveList == null) {
      throw Error(
        "Data.PokemonMoveList is uninitialized! Load it using LoadPokemonMoveListJSON() or set it directly first!"
      );
    }

    this.Form = form;

    const moveSet = form.MoveSet || form.Pokemon.GetForm()?.MoveSet;

    if (!moveSet) {
      throw Error(
        `Pokemon (#${form.Pokemon.DexNum}) ${form.Pokemon.Name} does not have a valid MoveSet assigned!`
      );
    }

    const data = Data.PokemonMoveList.find(
      (p) => p.DexNum === form.Pokemon.DexNum
    );
    if (!data) {
      throw Error(
        `Could not find move list data for (#${form.Pokemon.DexNum})!`
      );
    }

    this.ExtraMove = form.ExtraMove ? new Move(form.ExtraMove, form) : null;
    this.SignatureSuperMove = form.SignatureSuperMove
      ? new Move(form.SignatureSuperMove)
      : null;

    const onlyOneForm = data.LevelUpMoveLists.length === 1;

    this.LevelUpMoves =
      data.LevelUpMoveLists.find(
        (l) => onlyOneForm || l.Form === moveSet
      )?.LevelUpMoves.map((m) => new LevelUpMove(m.Name, m.Level, form)) ?? [];

    this.EggMoves = data.EggMoves.filter(
      (m) => onlyOneForm || m.Forms.includes(moveSet)
    ).map((m) => new Move(m.Name, form));

    this.TutorMoves = data.TutorMoves.filter(
      (m) => onlyOneForm || m.Forms.includes(moveSet)
    ).map((m) => new Move(m.Name, form));

    this.MachineMoves = data.MachineMoves.filter(
      (m) => onlyOneForm || m.Forms.includes(moveSet)
    ).map((m) => new Move(m.Name, form));

    this.OtherGenerationTutorMoves =
      data.OtherGenerationTutorMoves?.filter(
        (m) => onlyOneForm || m.Forms.includes(moveSet)
      ).map((m) => new Move(m.Name, form)) ?? [];

    this.OtherGenerationMachineMoves =
      data.OtherGenerationMachineMoves?.filter(
        (m) => onlyOneForm || m.Forms.includes(moveSet)
      ).map((m) => new Move(m.Name, form)) ?? [];
  }

  GetUnfilteredMaxMoves() {
    if (this.cachedUnfilteredMaxMoves) return this.cachedUnfilteredMaxMoves;

    const maxMoves = GetDefaultMaxMoves();
    if (
      this.SignatureSuperMove &&
      Data.SpeciesGMaxMovesTypes[this.SignatureSuperMove.Name]
    ) {
      maxMoves[Data.SpeciesGMaxMovesTypes[this.SignatureSuperMove.Name]] =
        this.SignatureSuperMove;
    }

    this.cachedUnfilteredMaxMoves = maxMoves;
    return this.cachedUnfilteredMaxMoves;
  }

  GetUnfilteredZMoves() {
    if (this.cachedUnfilteredZMoves) return this.cachedUnfilteredZMoves;

    let zMoves: Record<string, Move> = GetDefaultZMoves();
    if (
      this.SignatureSuperMove &&
      Data.SpeciesZMoveBaseMoves[this.SignatureSuperMove.Name]
    ) {
      zMoves[Data.SpeciesZMoveBaseMoves[this.SignatureSuperMove.Name]] =
        this.SignatureSuperMove;
    }

    this.cachedUnfilteredZMoves = zMoves;
    return this.cachedUnfilteredZMoves;
  }

  GetMaxMoves() {
    if (Data.MoveDex == null) {
      throw Error(
        "MoveList.GetMaxMoves(): Data.MoveDex is uninitialized! Load it using LoadMoveDexJSON() or set it directly first!"
      );
    }

    if (this.cachedMaxMoves) return this.cachedMaxMoves;

    let typeList: (PokemonType | "Status")[] = [];
    [
      ...this.LevelUpMoves,
      ...this.EggMoves,
      ...this.TutorMoves,
      ...this.MachineMoves,
      this.ExtraMove,
    ].forEach((m) => {
      if (m == null) return;

      let moveInfo = m.GetMoveInfo();
      if (moveInfo.Category === "Status") {
        if (!typeList.includes("Status")) typeList.push("Status");
      } else {
        if (!typeList.includes(moveInfo.Type)) typeList.push(moveInfo.Type);
      }
    });

    let result: Move[] = [];
    let unfilteredMoves = this.GetUnfilteredMaxMoves();
    Object.keys(unfilteredMoves).forEach((k) => {
      if (typeList.includes(k as PokemonType | "Status"))
        result.push(unfilteredMoves[k as PokemonType | "Status"]);
    });

    this.cachedMaxMoves = result;
    return this.cachedMaxMoves;
  }

  GetZMoves() {
    if (Data.MoveDex == null) {
      throw Error(
        "MoveList.GetZMoves(): Data.MoveDex is uninitialized! Load it using LoadMoveDexJSON() or set it directly first!"
      );
    }

    if (this.cachedZMoves) return this.cachedZMoves;

    let typeList: PokemonType[] = [];
    [
      ...this.LevelUpMoves,
      ...this.EggMoves,
      ...this.TutorMoves,
      ...this.MachineMoves,
      this.ExtraMove,
    ].forEach((m) => {
      if (m == null) return;

      let moveInfo = m.GetMoveInfo();
      if (moveInfo.Category !== "Status" && !typeList.includes(moveInfo.Type))
        typeList.push(moveInfo.Type);
    });

    let result: Move[] = [];
    let unfilteredMoves = this.GetUnfilteredZMoves();
    Object.keys(unfilteredMoves).forEach((k) => {
      if (
        typeList.includes(k as PokemonType) ||
        Data.SpeciesZMoveBaseMoves[unfilteredMoves[k].Name]
      )
        result.push(unfilteredMoves[k]);
    });

    this.cachedZMoves = result;
    return this.cachedZMoves;
  }
}
