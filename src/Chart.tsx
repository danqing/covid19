import Papa from "papaparse";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import produce from "immer";
import _ from "lodash";
import { AppState } from "./redux/reducers";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { setRegions } from "./redux/actions";
import { connect } from "react-redux";
import { IRegion } from "./redux/region";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";

dayjs.extend(dayOfYear);

const START_DATE = dayjs("2020-01-27");

const range = (n: number): number[] => Array.from(Array(n).keys());

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

type Point = { x: number; y: number | null };

const casesToPoints = (
  cases: CountryCases,
  offset: number,
  zoom: number
): Point[] => {
  const dayToCases = _.fromPairs(
    _.map(cases, ({ cases, year }) => [year, cases])
  );

  const daysToShow = Math.max(6 - zoom, 1) * 10;

  return range(daysToShow).map(idx => ({
    x: idx,
    y: dayToCases[idx - offset] || null
  }));
};

const colors = [
  "red",
  "green",
  "blue",
  "purple",
  "brown",
  "gray",
  "orange",
  "turquoise",
  "gray"
];

export const getCountryToColor = (countries: string[]) => {
  const sortedCountries = _.sortBy(countries);
  return _.fromPairs(
    _.map(countries, country => {
      const countryIdx = sortedCountries.indexOf(country);
      return [country, colors[countryIdx]];
    })
  );
};

type CountryToOffset = { [country: string]: number };

const getData = async (countryToOffset: CountryToOffset, zoom: number) => {
  const countryToCases: any = {};

  const countryToColor = getCountryToColor(Object.keys(countryToOffset));

  for (const country of Object.keys(countryToOffset)) {
    countryToCases[country] = await getCasesForCountry(country);
  }

  const datasets = _.map(countryToOffset, (offset, country) => {
    const color = countryToColor[country];
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
      data: casesToPoints(countryToCases[country], offset, zoom)
    };
  });

  const data = {
    datasets
  };

  return data;
};

function _Chart({
  regions,
  setRegions,
  zoom
}: {
  regions: IRegion[];
  setRegions: (regions: IRegion[]) => void;
  zoom: number;
}) {
  const countryToOffset = _.fromPairs(
    _.map(regions, ({ country, offset }) => [country, offset])
  );

  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    const _data = await getData(countryToOffset, zoom);
    setData(_data);
  };

  const countryOffsetState = JSON.stringify(countryToOffset);
  useEffect(() => {
    fetchData();
  }, [countryOffsetState, zoom]);

  if (!data) {
    return <div>loading</div>;
  }

  return (
    <div>
      <Line
        legend={null}
        data={data}
        options={{
          scales: {
            xAxes: [
              {
                type: "linear",
                ticks: {
                  min: 0
                },
                display: false,
                gridLines: {
                  drawBorder: true
                }
              }
            ]
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem: any, data: any) {
                console.log(tooltipItem, data);
                const { datasetIndex, index } = tooltipItem;
                const dataset = data.datasets[datasetIndex];
                const country = dataset["label"];

                const countryOffset = countryToOffset[country];

                const dayString = START_DATE.add(
                  index - countryOffset,
                  "day"
                ).format("MMM D");
                return `${country} ${dayString}`;
              }
            }
          }
        }}
      />
    </div>
  );
}
const mapStateToProps = (state: AppState) => ({
  regions: state.regions,
  zoom: state.zoom
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ setRegions }, dispatch);

export const Chart = connect(mapStateToProps, mapDispatchToProps)(_Chart);
