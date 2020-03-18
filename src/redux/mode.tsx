import TotalDeaths from "../data/total-deaths-covid-19-who.json";
import DailyDeaths from "../data/daily-deaths-covid-19-who.json";
import TotalCases from "../data/total-cases-covid-19-who.json";
import DailyCases from "../data/daily-cases-covid-19-who.json";

export enum EMode {
  TotalCases = "tc",
  TotalCasesPP = "tcpp",
  DailyCases = "dc",
  DailyCasesPP = "dcpp",
  TotalDeaths = "td",
  TotalDeathsPP = "tdpp",
  DailyDeaths = "dd",
  DailyDeathsPP = "ddpp"
}

type DataRow = { country: string; code: string; year: number; cases: number };
export const ModeToAllCountryData: Record<EMode, DataRow[]> = {
  [EMode.TotalCases]: TotalCases,
  [EMode.TotalCasesPP]: TotalCases,
  [EMode.DailyCases]: DailyCases,
  [EMode.DailyCasesPP]: DailyCases,
  [EMode.TotalDeaths]: TotalDeaths,
  [EMode.TotalDeathsPP]: TotalDeaths,
  [EMode.DailyDeaths]: DailyDeaths,
  [EMode.DailyDeathsPP]: DailyDeaths
};

export const all: EMode[] = [
  EMode.TotalCases,
  EMode.TotalCasesPP,
  EMode.DailyCases,
  EMode.DailyCasesPP,
  EMode.TotalDeaths,
  EMode.TotalDeathsPP,
  EMode.DailyDeaths,
  EMode.DailyDeathsPP
];

export function toString(mode: EMode): string {
  switch (mode) {
    case EMode.TotalCases:
      return "Total Cases";
    case EMode.TotalCasesPP:
      return "Total Cases per 1mm Pop."
    case EMode.DailyCases:
      return "Daily Cases";
    case EMode.DailyCasesPP:
      return "Daily Cases per 1mm Pop."
    case EMode.TotalDeaths:
      return "Total Deaths";
    case EMode.TotalDeathsPP:
      return "Total Deaths per 1mm Pop."
    case EMode.DailyDeaths:
      return "Daily Deaths";
    case EMode.DailyDeathsPP:
      return "Daily Deaths per 1mm Pop."
  }
}
