import React from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";

import { AppState } from "./redux/reducers";
import * as region from "./redux/region";
import { PlusSign } from "./svg";

import "./x-axis.css";

type TXAxisProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class XAxis extends React.PureComponent<TXAxisProps, {}> {

  renderRegion(r: region.IRegion): JSX.Element {
    return (
      <div>

      </div>
    );
  }

  renderRegionInput(): JSX.Element {
    return (
      <div>

      </div>
    );
  }

  renderAddRegion(): JSX.Element {
    return (
      <div id="add-region">
        <button className="btn btn-primary">
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
        {this.renderAddRegion()}
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
