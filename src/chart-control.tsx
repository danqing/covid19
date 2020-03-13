import React from "react";

import "./chart-control.css";

export default class ChartControl extends React.Component {
  renderModePicker(): JSX.Element {
    return (
      <div className="dropdown">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Confirmed Cases
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="#">Action</a>
          <a className="dropdown-item" href="#">Another action</a>
          <a className="dropdown-item" href="#">Something else here</a>
        </div>
      </div>
    );
  }

  renderZoomControl(): JSX.Element {
    return (
      <div id="zoom-control" className="btn-group" aria-label="Zoom">
        <button type="button" className="btn btn-sm btn-light">-</button>
        <button type="button" className="btn btn-sm btn-light">+</button>
      </div>
    );
  }

  renderScaleToggle(): JSX.Element {
    return (
      <div id="scale-toggle" className="btn-group" aria-label="Scale">
        <button type="button" className="btn btn-link">Linear</button>
        <button type="button" className="btn btn-link">Log</button>
      </div>
    );
  }

  render() {
    return (
      <div id="chart-control">
        {this.renderModePicker()}
        <div>
          {this.renderScaleToggle()}
          {this.renderZoomControl()}
        </div>
      </div>
    );
  }
}
