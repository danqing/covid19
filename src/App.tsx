import React from "react";

import ChartControl from "./chart-control";
import XAxis from "./x-axis";

import "./App.css";
import { Chart } from "./Chart";

function App() {
  return (
    <div className="container">
      <div id="title-row" className="row">
        <div className="col-12 mx-auto">
          <h1>COVID-19 Data Explorer</h1>
          <div id="title-separator" />
        </div>
      </div>
      <ChartControl />

      <Chart />
      <XAxis />
    </div>
  );
}

export default App;
