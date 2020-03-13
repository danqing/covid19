import dayjs from "dayjs";

export interface IRegion {
  country: string;
  state: string;
  day: dayjs.Dayjs;
}

export function toString(region: IRegion): string {
  let parts: string[] = [region.country];
  if (region.state !== "") {
    parts.push(region.state);
  }
  parts.push(region.day.format("YYYYMMDD"));
  return parts.join(",");
}

export function fromString(str: string): IRegion {
  let region = {country: "us", state: "", day: dayjs()};

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
