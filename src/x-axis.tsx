import dayjs from "dayjs";
import React from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";

import { addRegion, removeRegion, shiftRegion } from "./redux/actions";
import { AppState } from "./redux/reducers";
import * as region from "./redux/region";
import * as svg from "./svg";

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

  dayString(day: dayjs.Dayjs): string {
    const date = day.date();
    if (date === 1 || date % 5 === 0) {
      return day.format("MMM D");
    }
    return day.format("D");
  }

  renderDays(offset: number): JSX.Element {
    const zero = dayjs("2020-01-21");
    return (
      <div className="region-days-wrapper">
        <div className="region-days-gradient"/>
        <div className="region-days baseline-flex">
          {[...Array(50).keys()].map(d => (
            <div key={d} className="region-day">
              {this.dayString(zero.add(d, "day"))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderRegion(r: region.IRegion): JSX.Element {
    return (
      <div className="region-row" key={r.country}>
        <div className="region-shifter region-shifter-left">
          <button className="btn btn-link">
            <svg.ChevronsLeft/>
          </button>
          <button className="btn btn-link">
            <svg.ChevronLeft/>
          </button>
        </div>
        <div className="region-name-wrapper">
          <div className="region-name">{r.country}</div>
          <button className="btn btn-link" onClick={this.removeRegion}>
            <svg.TrashSign/>
          </button>
        </div>
        {this.renderDays(r.offset)}
        <div className="region-shifter region-shifter-right">
          <button className="btn btn-link">
            <svg.ChevronRight/>
          </button>
          <button className="btn btn-link">
            <svg.ChevronsRight/>
          </button>
        </div>
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
            <svg.TrashSign/>
          </button>
        </div>
      </div>
    );
  }

  renderAddRegion(): JSX.Element {
    return (
      <div id="add-region" className="region-row">
        <button className="btn btn-primary" onClick={this.showNewRegionInput}>
          <svg.PlusSign/>
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
