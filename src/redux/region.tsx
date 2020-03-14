export interface IRegion {
  country: string;
  offset: number;
}

export function toString(region: IRegion): string {
  return `${region.country},${region.offset}`;
}

export function fromString(str: string): IRegion {
  let region = { country: "United States", offset: 0 };

  const parts = str.split(",");
  if (parts.length === 0) {
    return region;
  }

  const [country, _offset] = parts;
  return {
    country,
    offset: parseInt(_offset) || 0
  };
}
