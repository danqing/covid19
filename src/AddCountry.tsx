import algoliasearch from "algoliasearch/lite";
import * as svg from "./svg";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { addRegion } from "./redux/actions";
import "./AddCountry.css";

const searchClient = algoliasearch(
  "3BK81OKMN1",
  "156309880d4fe2e742b637c8858f68ee"
);
const searchIndex = searchClient.initIndex("covid");

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
    const { hits } = await searchIndex.search(q);
    console.log(hits);
    // @ts-ignore
    const _suggestions = hits.map(hit => hit.name).slice(0, 5);

    setSuggestions(_suggestions);
  };

  useEffect(() => {
    getSuggestions(q);
  }, [q]);

  return (
    <div id="region-input-row" className="region-row text-center">
      <div
        className="region-name-wrapper"
        style={{ display: "flex", justifyContent: "center" }}
      >
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
      <div className="autocomplete">
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
