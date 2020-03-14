import dayjs from "dayjs";
import React from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";

import { addRegion, removeRegion, shiftRegion } from "./redux/actions";
import { AppState } from "./redux/reducers";
import * as region from "./redux/region";
import { PlusSign, TrashSign } from "./svg";

import "./x-axis.css";

type TXAxisProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

interface IXAxisState {
  enteringRegion: boolean;
}

class XAxis extends React.PureComponent<TXAxisProps, IXAxisState> {
  constructor(props: TXAxisProps) {
    super(props);

    this.state = {enteringRegion: false};
    this.addRegion = this.addRegion.bind(this);
    this.removeRegion = this.removeRegion.bind(this);
    this.showNewRegionInput = this.showNewRegionInput.bind(this);
    this.dismissNewRegionInput = this.dismissNewRegionInput.bind(this);
  }

  addRegion(e: React.KeyboardEvent<HTMLElement>) {
    console.log(e);
  }

  removeRegion(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      this.props.removeRegion(parseInt(e.target.dataset["index"]!));
    }
  }

  showNewRegionInput() {
    this.setState({enteringRegion: true});
  }

  dismissNewRegionInput() {
    this.setState({enteringRegion: false});
  }

  renderDays(offset: number): JSX.Element {
    const zero = dayjs("2020-01-21");
    return (
      <div className="region-days-wrapper">
        <div className="region-days-gradient"/>
        <div className="region-days baseline-flex">
          {[...Array(50).keys()].map(d => (
            <div className="region-day">
              {zero.add(d, "day").format("MMDD")}
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderRegion(r: region.IRegion): JSX.Element {
    return (
      <div className="region-row" key={r.country}>
        <div className="region-name-wrapper">
          <div className="region-name">{r.country}</div>
          <button className="btn btn-link" onClick={this.removeRegion}>
            <TrashSign />
          </button>
        </div>
        {this.renderDays(r.offset)}
      </div>
    );
  }

  renderRegionInput(): JSX.Element {
    return (
      <div id="region-input-row" className="region-row">
        <div className="region-name-wrapper">
          <input className="form-control" type="text" autoFocus={true}
            placeholder="Country or region" onKeyUp={this.addRegion}/>
          <button className="btn btn-link" onClick={this.dismissNewRegionInput}>
            <TrashSign />
          </button>
        </div>
      </div>
    );
  }

  renderAddRegion(): JSX.Element {
    return (
      <div id="add-region" className="region-row">
        <button className="btn btn-primary" onClick={this.showNewRegionInput}>
          <PlusSign/>
          <span>Add Country / Region</span>
        </button>
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <div id="x-axis">
        <hr/>
        {this.props.regions.map(r => this.renderRegion(r))}
        {this.state.enteringRegion ?
          this.renderRegionInput() : this.renderAddRegion()}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  regions: state.regions,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ addRegion, removeRegion, shiftRegion }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(XAxis);
