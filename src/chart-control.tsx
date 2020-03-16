import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";

import { changeMode, changeZoom, toggleScale } from "./redux/actions";
import * as mode from "./redux/mode";
import { AppState, EScale } from "./redux/reducers";
import { PlusSign, MinusSign } from "./svg";

import "./chart-control.css";
import { TwitterButton } from "./TwitterButton";

type TChartControlProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class ChartControl extends React.PureComponent<TChartControlProps, {}> {
  constructor(props: TChartControlProps) {
    super(props);

    this.changeMode = this.changeMode.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.toggleScale = this.toggleScale.bind(this);
  }

  changeMode(key: string) {
    this.props.changeMode(key);
  }

  renderModePicker(): JSX.Element {
    return (
      <Dropdown id="mode-control" onSelect={this.changeMode}>
        <Dropdown.Toggle variant="light" id="mode-dropdown">
          {mode.toString(this.props.mode)}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {mode.all.map(m => (
            <Dropdown.Item key={m} eventKey={m}>
              {mode.toString(m)}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
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
          <MinusSign />
        </button>
        <button
          type="button"
          className="btn btn-sm btn-light"
          disabled={this.props.zoom === 5}
          onClick={this.zoomIn}
        >
          <PlusSign />
        </button>
      </div>
    );
  }

  toggleScale(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      if (e.target.dataset["key"] !== this.props.scale) {
        this.props.toggleScale();
      }
    }
  }

  renderScaleToggle(): JSX.Element {
    const baseClass = "btn btn-link btn-sm";
    return (
      <div id="scale-toggle" className="btn-group" aria-label="Scale">
        {[EScale.Linear, EScale.Log].map(s => (
          <button
            key={s}
            data-key={s}
            type="button"
            className={baseClass + (this.props.scale === s ? " selected" : "")}
            onClick={this.toggleScale}
          >
            {s}
          </button>
        ))}
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <div id="chart-control" className="baseline-flex">
        {this.renderModePicker()}
        <div className="baseline-flex">
          {this.renderScaleToggle()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  zoom: state.zoom,
  mode: state.mode,
  scale: state.scale
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ changeMode, changeZoom, toggleScale }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChartControl);
