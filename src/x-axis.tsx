import React from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";

import { AppState } from "./redux/reducers";
import * as region from "./redux/region";
import { PlusSign } from "./svg";

import "./x-axis.css";

type TXAxisProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

interface IXAxisState {
  enteringRegion: boolean;
}

class XAxis extends React.PureComponent<TXAxisProps, IXAxisState> {
  constructor(props: TXAxisProps) {
    super(props);

    this.state = {enteringRegion: false};
    this.removeRegion = this.removeRegion.bind(this);
    this.showNewRegionInput = this.showNewRegionInput.bind(this);
    this.dismissNewRegionInput = this.dismissNewRegionInput.bind(this);
  }

  removeRegion() {

  }

  showNewRegionInput() {
    this.setState({enteringRegion: true});
  }

  dismissNewRegionInput() {
    this.setState({enteringRegion: false});
  }

  renderDays(): JSX.Element {
    return (
      <div>

      </div>
    );
  }

  renderRegion(r: region.IRegion): JSX.Element {
    return (
      <div className="region-row">

      </div>
    );
  }

  renderRegionInput(): JSX.Element {
    return (
      <div className="region-row region-input-row">
        <input className="form-control" type="text"
          placeholder="Country or region"/>
      </div>
    );
  }

  renderAddRegion(): JSX.Element {
    return (
      <div id="add-region">
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
  bindActionCreators({ }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(XAxis);
