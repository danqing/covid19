import { IRegion } from "./region";

export enum EReduxActionTypes {
  TOGGLE_SCALE = "toggle_scale",
  CHANGE_ZOOM = "change_zoom",
  CHANGE_MODE = "change_mode",
  SET_REGIONS = "set_regions",
  ADD_REGION = "add_region",
  REMOVE_REGION = "remove_region",
  SHIFT_REGION = "shift_region"
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

export interface IReduxAddRegionAction extends IReduxBaseAction {
  type: EReduxActionTypes.ADD_REGION;
  data: string;
}

export function addRegion(name: string): IReduxAddRegionAction {
  return { type: EReduxActionTypes.ADD_REGION, data: name };
}

export interface IReduxRemoveRegionAction extends IReduxBaseAction {
  type: EReduxActionTypes.REMOVE_REGION;
  data: number;
}

export function removeRegion(index: number): IReduxRemoveRegionAction {
  return { type: EReduxActionTypes.REMOVE_REGION, data: index };
}

export interface IReduxShiftRegionAction extends IReduxBaseAction {
  type: EReduxActionTypes.SHIFT_REGION;
  data: { index: number, by: number };
}

export function shiftRegion(index: number, by: number): IReduxShiftRegionAction {
  return { type: EReduxActionTypes.SHIFT_REGION, data: { index, by } };
}

export type ReduxAction =
  | IReduxToggleScaleAction
  | IReduxChangeModeAction
  | IReduxChangeZoomAction
  | IReduxSetRegionsAction
  | IReduxAddRegionAction
  | IReduxRemoveRegionAction
  | IReduxShiftRegionAction;
