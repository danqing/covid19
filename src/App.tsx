import React from "react";
import { connect } from "react-redux";

import { AppState } from "./redux/reducers";
import ChartControl from "./chart-control";
import { TwitterButton } from "./TwitterButton";
import VX from "./vx";
import XAxis from "./x-axis";

import "./App.css";

function App({ change }) {
  return (
    <div id="app-wrapper">
      <div id="title-row" className="row">
        <div className="col-12 mx-auto">
          <h1 id="page-title">COVID Rules Everything Around Me</h1>
          <h5 id="page-subtitle">
            Understand COVID growth rates between different countries.
          </h5>
          <div className="divider">
            <div id="title-separator" />
            <TwitterButton />
          </div>
          <div id="share-prompt" className={change ? "shown" : ""}>
            Share this page and others can see exactly the chart you have made!
          </div>
        </div>
      </div>
      <ChartControl />
      <div className="chart">
        <div className="vx-wrapper">
          <VX />
        </div>

        <XAxis />
      </div>
      <footer>
        <p>
          Made by <a href={"https://twitter.com/danqing_liu"}>@danqing_liu</a>
          &nbsp;and{" "}
          <a href={"https://twitter.com/victorpontis"}>@victorpontis</a>
          &nbsp;with data pulled from&nbsp;
          <a href={"https://ourworldindata.org/coronavirus"}>
            Our World In Data
          </a>
          and the European CDC.
        </p>

        <p>
          Explore the code in&nbsp;
          <a href={"https://github.com/danqing/covid19/"}>GitHub</a>. Credit to
          Algolia for search.
        </p>

        <p>Last updated on March 19 18:00 ET.</p>
      </footer>
    </div>
  );
}

const mapStateToProps = (state: AppState) => ({
  change: state.change
});

export default connect(mapStateToProps)(App);
