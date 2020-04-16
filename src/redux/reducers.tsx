import qs from "query-string";

import * as actions from "./actions";
import { ReduxAction } from "./actions";
import * as mode from "./mode";
import * as region from "./region";
import { IRegion } from "./region";

export enum EScale {
  Linear = "linear",
  Log = "log"
}

export interface AppState {
  change: boolean;
  scale: EScale;
  zoom: number;
  mode: mode.EMode;
  regions: region.IRegion[];
}

const defaultState: AppState = {
  change: false,
  scale: EScale.Linear,
  zoom: 3,
  mode: mode.EMode.TotalCases,
  regions: [
    { country: "United States", offset: -75 },
    { country: "Italy", offset: -75 },
    { country: "Spain", offset: -75 }
  ]
};

export default function(state: AppState = loadState(), action: ReduxAction) {
  switch (action.type) {
    case actions.EReduxActionTypes.TOGGLE_SCALE:
      return toggleScale(state);
    case actions.EReduxActionTypes.CHANGE_ZOOM:
      return changeZoom(state, action.data);
    case actions.EReduxActionTypes.CHANGE_MODE:
      return changeMode(state, action.data);
    case actions.EReduxActionTypes.SET_REGIONS:
      return setRegions(state, action.data);
    case actions.EReduxActionTypes.ADD_REGION:
      return addRegion(state, action.data);
    case actions.EReduxActionTypes.REMOVE_REGION:
      return removeRegion(state, action.data);
    case actions.EReduxActionTypes.SHIFT_REGION:
      return shiftRegion(state, action.data.index, action.data.by);
    default:
      return state;
  }
}

function toggleScale(state: AppState): AppState {
  return persistedState({
    ...state,
    scale: state.scale === EScale.Linear ? EScale.Log : EScale.Linear
  });
}

function changeZoom(state: AppState, data: number): AppState {
  let zoom = state.zoom + data;
  if (zoom > 5) {
    zoom = 5;
  } else if (zoom < 1) {
    zoom = 1;
  }
  return persistedState({ ...state, zoom });
}

function changeMode(state: AppState, to: string): AppState {
  return persistedState({ ...state, mode: to as mode.EMode });
}

function setRegions(state: AppState, regions: IRegion[]): AppState {
  return persistedState({ ...state, regions });
}

function addRegion(state: AppState, name: string): AppState {
  let regions = [...state.regions];
  regions.push({ country: name, offset: -75 });
  return persistedState({ ...state, regions });
}

function removeRegion(state: AppState, index: number): AppState {
  let regions = [...state.regions];
  regions.splice(index, 1);
  return persistedState({ ...state, regions });
}

function shiftRegion(state: AppState, index: number, by: number): AppState {
  let regions = [...state.regions];
  regions[index] = { ...regions[index], offset: regions[index].offset + by };
  return persistedState({ ...state, regions });
}

function persistedState(state: AppState): AppState {
  let query = {
    s: state.scale,
    z: state.zoom,
    m: state.mode,
    r: state.regions.map(r => region.toString(r))
  };
  window.history.replaceState(null, "", "?" + qs.stringify(query));
  state.change = true;
  return state;
}

function loadState(): AppState {
  const query = qs.parse(window.location.search);
  let state = { ...defaultState };

  if (Object.values(EScale).includes(query.s as EScale)) {
    state.scale = query.s as EScale;
  }
  if (Object.values(mode.EMode).includes(query.m as mode.EMode)) {
    state.mode = query.m as mode.EMode;
  }
  if (Array.isArray(query.r)) {
    state.regions = query.r.map(r => region.fromString(r));
  } else if (query.r) {
    state.regions = [region.fromString(query.r)];
  }

  return state;
}
