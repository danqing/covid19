import { IRegion } from "./region";

export enum EReduxActionTypes {
  TOGGLE_SCALE = "toggle_scale",
  CHANGE_ZOOM = "change_zoom",
  CHANGE_MODE = "change_mode",
  SET_REGIONS = "set_regions"
}

export interface IReduxBaseAction {
  type: EReduxActionTypes;
}

export interface IReduxToggleScaleAction extends IReduxBaseAction {
  type: EReduxActionTypes.TOGGLE_SCALE;
}

export function toggleScale(): IReduxToggleScaleAction {
  return { type: EReduxActionTypes.TOGGLE_SCALE };
}

export interface IReduxChangeZoomAction extends IReduxBaseAction {
  type: EReduxActionTypes.CHANGE_ZOOM;
  data: number;
}

export function changeZoom(by: number): IReduxChangeZoomAction {
  return { type: EReduxActionTypes.CHANGE_ZOOM, data: by };
}

export interface IReduxChangeModeAction extends IReduxBaseAction {
  type: EReduxActionTypes.CHANGE_MODE;
  data: string;
}

export function changeMode(to: string): IReduxChangeModeAction {
  return { type: EReduxActionTypes.CHANGE_MODE, data: to };
}

export interface IReduxSetRegionsAction extends IReduxBaseAction {
  type: EReduxActionTypes.SET_REGIONS;
  data: IRegion[];
}

export function setRegions(regions: IRegion[]): IReduxSetRegionsAction {
  return { type: EReduxActionTypes.SET_REGIONS, data: regions };
}

export type ReduxAction =
  | IReduxToggleScaleAction
  | IReduxChangeModeAction
  | IReduxChangeZoomAction
  | IReduxSetRegionsAction;
