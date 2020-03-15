import * as svg from "./svg";
import React, { useEffect, useState } from "react";
import FuzzySet from "fuzzyset.js";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { addRegion } from "./redux/actions";
import { getAllConfirmedCases } from "./Chart";
import _ from "lodash";

let countrySet: FuzzySet;

export const _AddRegion = ({
  onSuccess,
  addRegion
}: {
  onSuccess: () => void;
  addRegion: (region: string) => void;
}) => {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const getSuggestions = async (q: string) => {
    if (!countrySet) {
      const allCases = await getAllConfirmedCases();
      const countries = _.uniq(allCases.map(({ entity }) => entity)).filter(
        s => s
      );
      countrySet = FuzzySet(countries);
    }

    const _suggestions = countrySet
      .get(q)
      ?.slice(0, 5)
      .map(([__, suggestion]) => suggestion);

    setSuggestions(_suggestions || []);
  };

  useEffect(() => {
    getSuggestions(q);
  }, [q]);

  return (
    <div>
      <div className={"d-flex region-name-wrapper"}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          className="form-control"
          style={{ maxWidth: 200 }}
          type="text"
          autoFocus={true}
          placeholder="Country or region"
        />

        <button
          className="btn btn-link"
          onClick={() => onSuccess()}
          style={{ color: "gray" }}
        >
          <svg.TrashSign />
        </button>
      </div>

      <div>
        {suggestions.map(suggestion => (
          <div
            key={suggestion}
            className={"btn btn-link"}
            onClick={() => {
              addRegion(suggestion);
              onSuccess();
            }}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ addRegion }, dispatch);

export const AddRegion = connect(null, mapDispatchToProps)(_AddRegion);
