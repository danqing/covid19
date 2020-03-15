import algoliasearch from "algoliasearch/lite";
import * as svg from "./svg";
import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {AnyAction, bindActionCreators, Dispatch} from "redux";
import {addRegion} from "./redux/actions";

const searchClient = algoliasearch(
  "ZOOMT5L4JY",
  "43a938b4fe4feea7874320d044a19bc5"
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
