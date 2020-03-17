// import TotalDeaths from "../data/total-deaths-covid-19-who.json";
import TotalDeaths from "../data/jhu-deaths.json";
// import DailyDeaths from "../data/daily-deaths-covid-19-who.json";
// import TotalCases from "../data/total-cases-covid-19-who.json";
import TotalCases from "../data/jhu-confirmed.json";
// import DailyCases from "../data/daily-cases-covid-19-who.json";

export enum EMode {
  TotalCases = "tc",
  // DailyCases = "dc",
  TotalDeaths = "td"
  // DailyDeaths = "dd"
}

type DataRow = { country: string; code: string; year: number; cases: number };
export const ModeToAllCountryData: Record<EMode, DataRow[]> = {
  [EMode.TotalCases]: TotalCases,
  // [EMode.DailyCases]: DailyCases,
  [EMode.TotalDeaths]: TotalDeaths
  // [EMode.DailyDeaths]: DailyDeaths
};

export const all: EMode[] = [
  EMode.TotalCases,
  // EMode.DailyCases,
  EMode.TotalDeaths
  // EMode.DailyDeaths
];

export function toString(mode: EMode): string {
  switch (mode) {
    case EMode.TotalCases:
      return "Total Cases";
    // case EMode.DailyCases:
    //   return "Daily Cases";
    case EMode.TotalDeaths:
      return "Total Deaths";
    // case EMode.DailyDeaths:
    //   return "Daily Deaths";
  }
}
