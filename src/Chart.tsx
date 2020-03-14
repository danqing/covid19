import Papa from "papaparse";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

async function fetchCsv<RowType>(path: string): Promise<RowType[]> {
  const file = await fetch(path);
  const data = await file.text();
  const { data: parsedData } = Papa.parse(data, {
    header: true,
    dynamicTyping: true
  });
  return parsedData;
}

type CasesPerDayRow = {
  entity: string;
  code: string;
  year: number;
  cases: number;
};

const getAllConfirmedCases = async (): Promise<CasesPerDayRow[]> => {
  return await fetchCsv<CasesPerDayRow>("/data/total-cases-covid-19-who.csv");
};

type CountryCases = Array<{ year: number; cases: number }>;

const getCasesForCountry = async (country: string): Promise<CountryCases> => {
  const allCases = await getAllConfirmedCases();

  return allCases.filter(({ entity }) => entity === country);
};

type Point = { x: number; y: number };

const casesToPoints = (cases: CountryCases): Point[] => {
  return cases.map(({ year, cases }) => ({ x: year, y: cases }));
};

const colors = ["red", "green", "blue"];

const getData = async (countries: string[]) => {
  const countryToCases: any = {};

  for (const country of countries) {
    countryToCases[country] = await getCasesForCountry(country);
  }

  const datasets = Array.from(countries.entries()).map(([idx, country]) => {
    const color = colors[idx];
    return {
      label: country,
      fill: false,
      lineTension: 0.1,
      backgroundColor: color,
      borderColor: color,
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: color,
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: color,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: casesToPoints(countryToCases[country])
    };
  });

  const data = {
    datasets
  };

  return data;
};

export function Chart() {
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    const _data = await getData(["China", "United States", "Italy"]);
    setData(_data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) {
    return <div>loading</div>;
  }

  return (
    <div>
      <h2>Line Example</h2>
      <Line
        legend={null}
        data={data}
        options={{
          scales: {
            xAxes: [
              {
                type: "linear"
              }
            ]
          }
        }}
      />
    </div>
  );
}
