
export enum EMode {
  Confirmed = "confirmed",
  ConfirmedNew = "confirmed_new",
  Deaths = "deaths",
  DeathsNew = "deaths_new",
}

export const all: EMode[] = [
  EMode.Confirmed,
  EMode.ConfirmedNew,
  EMode.Deaths,
  EMode.DeathsNew,
]

export function toString(mode: EMode): string {
  switch (mode) {
    case EMode.Confirmed:
      return "Total Confirmed"
    case EMode.ConfirmedNew:
      return "New Confirmed"
    case EMode.Deaths:
      return "Total Deaths"
    case EMode.DeathsNew:
      return "New Deaths"
  }
}
