import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import React from "react";
import Measure, { BoundingRect } from "react-measure";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";

import { addRegion, removeRegion, shiftRegion } from "./redux/actions";
import { AppState } from "./redux/reducers";
import * as region from "./redux/region";
import { AddRegion } from "./AddCountry";
import * as svg from "./svg";

import "./x-axis.css";

dayjs.extend(dayOfYear);

type TXAxisProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

interface IXAxisState {
  enteringRegion: boolean;
  dims: BoundingRect;
}

class XAxis extends React.PureComponent<TXAxisProps, IXAxisState> {
  constructor(props: TXAxisProps) {
    super(props);

    this.state = {
      enteringRegion: false,
      dims: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 1000,
        height: 1000
      }
    };
    this.addRegion = this.addRegion.bind(this);
    this.removeRegion = this.removeRegion.bind(this);
    this.shiftRegionBack1 = this.shiftRegionBack1.bind(this);
    this.shiftRegionBack5 = this.shiftRegionBack5.bind(this);
    this.shiftRegionForward1 = this.shiftRegionForward1.bind(this);
    this.shiftRegionForward5 = this.shiftRegionForward5.bind(this);
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

  shiftRegionBack1(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      this.props.shiftRegion(parseInt(e.target.dataset["index"]!), -1);
    }
  }

  shiftRegionBack5(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      this.props.shiftRegion(parseInt(e.target.dataset["index"]!), -5);
    }
  }

  shiftRegionForward1(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      this.props.shiftRegion(parseInt(e.target.dataset["index"]!), 1);
    }
  }

  shiftRegionForward5(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      this.props.shiftRegion(parseInt(e.target.dataset["index"]!), 5);
    }
  }

  showNewRegionInput() {
    this.setState({ enteringRegion: true });
  }

  dismissNewRegionInput() {
    this.setState({ enteringRegion: false });
  }

  dayString(day: dayjs.Dayjs): string {
    let modulo = 2;
    if (this.state.dims.width < 500) {
      modulo = 4;
    } else if (this.state.dims.width < 700) {
      modulo = 3;
    }
    const date = day.dayOfYear();
    return date % modulo === 0 ? day.format("M/D") : "·";
  }

  renderDays(offset: number, i: number): JSX.Element {
    const zero = dayjs("2020-01-21");
    return (
      <div className="region-days-wrapper">
        <div className="region-days-gradient" />
        <div
          className="region-days baseline-flex"
          style={{
            transform: `translateX(${(offset * 100) / 16}%`,
            color: `var(--series-color-${i % 6})`
          }}
        >
          {[...Array(120).keys()].map(d => (
            <div key={d} className="region-day">
              <div className="region-day-inner">
                {this.dayString(zero.add(d, "day"))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderOffset(offset: number): JSX.Element {
    if (this.props.regions.length === 0) {
      return <div />;
    }

    const base = this.props.regions[0].offset;
    const delta = offset - base;
    if (delta === 0) {
      return <div />;
    }

    const cls = delta > 0 ? "delta-ahead" : "delta-behind";
    return (
      <div className={cls + " delta"}>
        {`${Math.abs(delta)}d ${delta > 0 ? "ahead" : "behind"}`}
      </div>
    );
  }

  renderRegion(r: region.IRegion, i: number): JSX.Element {
    const buttonAttrs = { className: "btn btn-link", "data-index": i };
    return (
      <div className="region-row" key={r.country}>
        <div className="region-shifter region-shifter-left">
          <button {...buttonAttrs} onClick={this.shiftRegionBack5}>
            <svg.ChevronsLeft />
          </button>
          <button {...buttonAttrs} onClick={this.shiftRegionBack1}>
            <svg.ChevronLeft />
          </button>
        </div>
        <div className="region-name-wrapper">
          <div className="region-name-wrapper-inner">
            <div
              className="region-icon"
              style={{
                backgroundColor: `var(--series-color-${i % 6})`
              }}
            />
            <div className="region-name">{r.country}</div>
            <button {...buttonAttrs} onClick={this.removeRegion}>
              <svg.TrashSign />
            </button>
          </div>
          {this.renderOffset(r.offset)}
        </div>

        {this.renderDays(r.offset, i)}

        <div className="region-shifter region-shifter-right">
          <button {...buttonAttrs} onClick={this.shiftRegionForward1}>
            <svg.ChevronRight />
          </button>
          <button {...buttonAttrs} onClick={this.shiftRegionForward5}>
            <svg.ChevronsRight />
          </button>
        </div>
      </div>
    );
  }

  renderAddRegion(): JSX.Element {
    return (
      <div
        id="add-region"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <button className="btn btn-primary" onClick={this.showNewRegionInput}>
          <svg.PlusSign />
          <span>Add Country / Region</span>
        </button>
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <Measure
        bounds
        onResize={r => {
          r.bounds && this.setState({ dims: r.bounds });
        }}
      >
        {({ measureRef }) => (
          <div id="x-axis" ref={measureRef}>
            <hr />
            {this.props.regions.map((r, i) => this.renderRegion(r, i))}

            <p className="use-guide">
              Tip: Use
              <span style={{width: 24}} className={'yellow-arrow'}><svg.ChevronLeft /></span>
              and{" "}
              <span style={{width: 24}} className={'yellow-arrow'}><svg.ChevronRight /></span>
              to shift and compare countries at different times.
            </p>

            {this.state.enteringRegion ? (
              <AddRegion onSuccess={() => this.dismissNewRegionInput()} />
            ) : (
              this.renderAddRegion()
            )}
          </div>
        )}
      </Measure>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  regions: state.regions
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ addRegion, removeRegion, shiftRegion }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(XAxis);
