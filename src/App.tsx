import Papa from "papaparse";
import React, { useEffect, useState } from "react";

import "./App.css";
import ChartControl from "./chart-control";
import State from "./state";

function useCsvFetch<RowType>(path: string): RowType[] | null {
  const [csvData, setCsvData] = useState<RowType[] | null>(null);

  const getCsvData = async () => {
    const file = await fetch(path);
    const data = await file.text();
    const { data: parsedData } = Papa.parse(data, {
      header: true,
      dynamicTyping: true
    });
    setCsvData(parsedData);
  };

  useEffect(() => {
    getCsvData();
  }, []);

  return csvData;
}

type CountryPopulation = { country: string; population: number };

const useCountryPopulation = (): CountryPopulation[] | null => {
  return useCsvFetch<CountryPopulation>("/data/country-population.csv");
};

function App() {
  const countryPopulation = useCountryPopulation();
  console.log(countryPopulation);
  console.log(State.load());

  return (
    <div className="container">
      <div id="title-row" className="row">
        <div className="col-12 mx-auto">
          <h1>COVID-19 Data Explorer</h1>
          <div id="title-separator"/>
        </div>
      </div>
      <ChartControl/>
    </div>
  );
}

export default App;
