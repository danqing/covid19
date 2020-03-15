import React from "react";

import { Chart } from "./Chart";
import ChartControl from "./chart-control";
import XAxis from "./x-axis";

import "./App.css";

function App() {
  return (
    <div className="container">
      <div id="title-row" className="row">
        <div className="col-12 mx-auto">
          <h1>COVID-19 Data Explorer</h1>
          <h5>Let's flatten the curve together.</h5>
          <div id="title-separator" />
        </div>
      </div>
      <ChartControl />
      <Chart />
      <XAxis />
      <footer>Yada yada.</footer>
    </div>
  );
}

export default App;
