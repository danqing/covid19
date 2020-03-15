import React from "react";

import ChartControl from "./chart-control";
import VX from "./vx";
import XAxis from "./x-axis";

import "./App.css";

function App() {
  return (
    <div id="app-wrapper">
      <div id="title-row" className="row">
        <div className="col-12 mx-auto">
          <h1 id="page-title">COVID-19 Data Explorer</h1>
          <h5 id="page-subtitle">Let's flatten the curve together.</h5>
          <div id="title-separator" />
        </div>
      </div>
      <ChartControl />
      <VX />
      <XAxis />
      <footer>Yada yada.</footer>
    </div>
  );
}

export default App;
