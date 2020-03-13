import Papa from "papaparse";
import React, { useEffect, useState } from "react";

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

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-8 col-lg-6 mx-auto">
          <h1>COVID Graphs</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
