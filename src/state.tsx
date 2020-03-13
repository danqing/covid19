
import dayjs from "dayjs";
import qs from "query-string";

import { EnumParser } from "./util";

enum Scale {
  Linear = "linear",
  Log = "log",
}

enum Mode {
  Confirmed = "confirmed",
  Deaths = "deaths"
}

class Region {
  country: string = "us";
  state: string = "";
  day: dayjs.Dayjs = dayjs();

  static fromString(str: string): Region {
    let region = new Region();

    const parts = str.split(",");
    if (parts.length === 0) {
      return region;
    }

    region.country = parts[0];
    if (parts.length > 2) {
      region.state = parts[1];
      region.day = dayjs(parts[2], "YYYYMMDD");
    } else {
      region.day = dayjs(parts[1], "YYYYMMDD");
    }

    return region;
  }

  toString(): string {
    let parts: string[] = [this.country];
    if (this.state !== "") {
      parts.push(this.state);
    }
    parts.push(this.day.format("MMDD"));
    return parts.join(",");
  }
}

class URLState {
  scale: Scale = Scale.Linear;
  region: string[] = [];
  zoom: number = 3;
  mode: Mode = Mode.Confirmed;

  static load(): URLState {
    const query = qs.parse(window.location.search);
    let state = new URLState();
    state.scale = EnumParser.parse(query.scale, Scale, state.scale);
    state.mode = EnumParser.parse(query.mode, Mode, state.mode);
    if (Array.isArray(query.region)) {
      state.region = query.region;
    } else if (query.region) {
      state.region = [query.region];
    }
    return state;
  }

  persist() {
    const query = qs.stringify(Object.assign({}, this));
    window.history.replaceState(null, "", "?" + query);
  }
}

export default class State {
  private s: Scale = Scale.Linear;
  private r: Region[] = [];
  private z: number = 3;
  private m: Mode = Mode.Confirmed;

  get scale(): Scale {
    return this.s;
  }

  set scale(s: Scale) {
    if (this.s === s) {
      return;
    }
    this.s = s;
    this.persist();
  }

  get regions(): Region[] {
    return this.r;
  }

  get zoom(): number {
    return this.z;
  }

  get mode(): Mode {
    return this.m;
  }

  set mode(m: Mode) {
    if (this.m === m) {
      return;
    }
    this.m = m;
    this.persist();
  }

  toggleScale(): Scale {
    this.scale = this.scale === Scale.Linear ? Scale.Log : Scale.Linear;
    return this.scale;
  }

  changeZoom(by: number): number {
    this.z = this.z + by;
    this.persist();
    return this.zoom;
  }

  shiftRegion(index: number, by: number) {
    if (index >= this.regions.length) {
      return;
    }
    this.r[index].day = this.r[index].day.add(by, 'day');
    this.persist();
  }

  removeRegion(index: number) {
    this.r.splice(index, 1);
    this.persist();
  }

  addRegion(country: string, state: string) {
    let region = new Region();
    region.country = country;
    region.state = state;
    region.day = dayjs();
    this.r.push(region);
    this.persist();
  }

  static load(): State {
    const urlState = URLState.load();
    let state = new State();
    state.s = urlState.scale;
    state.m = urlState.mode;
    state.r = urlState.region.map(r => Region.fromString(r));
    return state;
  }

  persist() {
    let state = new URLState();
    state.scale = this.scale;
    state.mode = this.mode;
    state.region = this.regions.map(r => r.toString());
    state.persist();
  }

}
