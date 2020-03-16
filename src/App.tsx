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
          <h1 id="page-title">COVID Rules Everything Around Me</h1>
          <h5 id="page-subtitle">
            Understand COVID growth rates between different countries.
          </h5>
          <div id="title-separator" />
        </div>
      </div>
      <ChartControl />
      <div className="vx-wrapper">
        <VX />
      </div>

      <XAxis />

      <footer>
        <p>
          Made by <a href={"https://twitter.com/danqing_liu"}>@danqing_liu</a>{" "}
          and <a href={"https://twitter.com/victorpontis"}>@victorpontis</a>{" "}
          with data pulled from{" "}
          <a href={"https://ourworldindata.org/coronavirus"}>
            Our World In Data
          </a>
          .
        </p>

        <p>
          Explore the code in{" "}
          <a href={"https://github.com/danqing/covid19/"}>Github</a>. Credit to
          Algolia for search.
        </p>

        <p>Last updated on March 15 21:00 ET.</p>
      </footer>
    </div>
  );
}

export default App;
