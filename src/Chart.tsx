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

const casesToPoints = (cases: CountryCases, offset: number): Point[] => {
  return cases.map(({ year, cases }) => ({ x: year + offset, y: cases }));
};

const colors = ["red", "green", "blue"];

type CountryToOffset = { [country: string]: number };

const getData = async (countryToOffset: CountryToOffset) => {
  const countryToCases: any = {};

  const sortedCountries = _.sortBy(Object.keys(countryToOffset));
  const countryToColor = _.fromPairs(
    _.map(countryToOffset, (_offset, country) => {
      const countryIdx = sortedCountries.indexOf(country);
      return [country, colors[countryIdx]];
    })
  );

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
      data: casesToPoints(countryToCases[country], offset)
    };
  });

  const data = {
    datasets
  };

  return data;
};

function _Chart({
  regions,
  setRegions
}: {
  regions: IRegion[];
  setRegions: (regions: IRegion[]) => void;
}) {
  const countryToOffset = _.fromPairs(
    _.map(regions, ({ country, offset }) => [country, offset])
  );

  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    const _data = await getData(countryToOffset);
    setData(_data);
  };

  const countryOffsetState = JSON.stringify(countryToOffset);
  useEffect(() => {
    fetchData();
  }, [countryOffsetState]);

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
                type: "linear",
                ticks: {
                  min: 0
                }
              }
            ]
          }
        }}
      />

      <div>
        {_.map(countryToOffset, (offset, country) => (
          <div key={country}>
            {country} {offset}
            <div
              className="btn btn-link btn-sm"
              onClick={() => {
                const newRegions = produce(regions, draft => {
                  draft.forEach(region => {
                    if (region.country === country) {
                      region.offset -= 1;
                    }
                  });
                });
                setRegions(newRegions);
              }}
            >
              -
            </div>
            <div
              className="btn btn-link btn-sm"
              onClick={() => {
                const newRegions = produce(regions, draft => {
                  draft.forEach(region => {
                    if (region.country === country) {
                      region.offset += 1;
                    }
                  });
                });
                setRegions(newRegions);
              }}
            >
              +
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
const mapStateToProps = (state: AppState) => ({
  regions: state.regions
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ setRegions }, dispatch);

export const Chart = connect(mapStateToProps, mapDispatchToProps)(_Chart);
