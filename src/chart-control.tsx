import React from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";

import { changeMode, changeZoom, toggleScale } from "./redux/actions";
import * as mode from "./redux/mode";
import { AppState } from "./redux/reducers";
import { PlusSign, MinusSign } from "./svg";

import "./chart-control.css";

type TChartControlProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ChartControl extends React.PureComponent<TChartControlProps, {}> {

  constructor(props: TChartControlProps) {
    super(props);

    this.changeMode = this.changeMode.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  changeMode(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      this.props.changeMode(e.target.dataset["key"] || "");
    }
  }

  renderModePickerItem(m: mode.EMode): JSX.Element {
    return (
      <div
        key={m}
        data-key={m}
        className="dropdown-item"
        onClick={this.changeMode}
      >
        {mode.toString(m)}
      </div>
    )
  }

  renderModePicker(): JSX.Element {
    return (
      <div className="dropdown">
        <button
          className="btn btn-light dropdown-toggle"
          type="button"
          id="modeButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {mode.toString(this.props.mode)}
        </button>
        <div className="dropdown-menu" aria-labelledby="modeButton">
          {mode.all.map(m => this.renderModePickerItem(m))}
        </div>
      </div>
    );
  }

  zoomOut() {
    this.props.changeZoom(-1);
  }

  zoomIn() {
    this.props.changeZoom(1);
  }

  renderZoomControl(): JSX.Element {
    return (
      <div id="zoom-control" className="btn-group" aria-label="Zoom">
        <button
          type="button"
          className="btn btn-sm btn-light"
          disabled={this.props.zoom === 1}
          onClick={this.zoomOut}
        >
          <MinusSign/>
        </button>
        <button
          type="button"
          className="btn btn-sm btn-light"
          disabled={this.props.zoom === 5}
          onClick={this.zoomIn}
        >
          <PlusSign/>
        </button>
      </div>
    );
  }

  renderScaleToggle(): JSX.Element {
    return (
      <div id="scale-toggle" className="baseline-flex">
        <span>Scale:</span>
        <div className="btn-group" aria-label="Scale">
          <button type="button" className="btn btn-link">Linear</button>
          <button type="button" className="btn btn-link">Log</button>
        </div>
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <div id="chart-control" className="baseline-flex">
        {this.renderModePicker()}
        <div className="baseline-flex">
          {this.renderScaleToggle()}
          {this.renderZoomControl()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  zoom: state.zoom,
  mode: state.mode,
  scale: state.scale,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ changeMode, changeZoom, toggleScale }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChartControl);
