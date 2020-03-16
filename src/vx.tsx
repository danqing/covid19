import dayjs from "dayjs";
import { max } from "d3-array";
import React from "react";
import Measure, { BoundingRect } from "react-measure";
import { connect } from "react-redux";
import _ from "lodash";
import { format } from "d3-format";

import { AxisLeft } from "@vx/axis";
import { Grid } from "@vx/grid";
import { Bar, Line, LinePath } from "@vx/shape";
import { curveMonotoneX } from "@vx/curve";
import { scaleLinear, scaleLog } from "@vx/scale";
import { Tooltip, withTooltip } from "@vx/tooltip";
import { WithTooltipProvidedProps } from "@vx/tooltip/lib/enhancers/withTooltip";
import { localPoint } from "@vx/event";

import { ModeToAllCountryData } from "./redux/mode";
import { AppState, EScale } from "./redux/reducers";

import "./vx.css";

const range = (n: number): number[] => Array.from(Array(n).keys());
const logTicks = new Set([1, 10, 100, 1000, 10000, 100000]);

interface IVXDataPoint {
  date: number;
  value: number;
}

interface IVXDataSeries {
  name: string;
  color: string;
  offset: number;
  points: IVXDataPoint[];
}

const x = (d: IVXDataPoint) => d.date;
const y = (d: IVXDataPoint) => d.value;

interface IVXProps {}

export interface IVXMarginShape {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface IVXProvidedProps {
  margin?: IVXMarginShape;
  events?: boolean;
}

interface IVXTooltipData {
  name: string;
  color: string;
  offset: number;
  date: number;
  value: number;
  y: number;
}

type TVXProps = IVXProps &
  IVXProvidedProps &
  ReturnType<typeof mapStateToProps>;

const DAYS_TO_SHOW = 17;

const VX = withTooltip<TVXProps, IVXTooltipData[]>(
  ({
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
    mode,
    scale,
    regions
  }: TVXProps & WithTooltipProvidedProps<IVXTooltipData[]>) => {
    const [dims, setDims] = React.useState<BoundingRect>({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 100,
      height: 100
    });

    const xMax = dims.width - margin.left - margin.right;
    const yMax = dims.height - margin.top - margin.bottom;

    const vxData: IVXDataSeries[] = [];
    const allCountryData = ModeToAllCountryData[mode];

    regions.forEach(({ country, offset }, idx) => {
      const countryData = allCountryData.filter(
        countryRow => countryRow.country === country
      );

      const dayToCases = _.fromPairs(
        _.map(countryData, ({ cases, year }) => [year, cases])
      );

      const points = range(DAYS_TO_SHOW)
        .map(idx => ({
          date: idx,
          value: dayToCases[idx - offset] || 0
        }))
        .filter(point => point.value !== null && point.value !== 0);

      vxData.push({
        name: country,
        color: `var(--series-color-${vxData.length % 6})`,
        offset,
        points
      });
    });

    const tooltipShifter = (data: IVXTooltipData[]): IVXTooltipData[] => {
      if (data.length < 2) {
        return data;
      }

      data = data.sort((a, b) => (a.y > b.y) ? 1 : -1);
      const middle = Math.floor(data.length / 2);

      if (data[middle].y - data[middle - 1].y < 50) {
        data[middle].y = data[middle].y + 25;
        data[middle - 1].y = data[middle - 1].y - 25;
      }

      for (let i = middle - 2; i >= 0; i--) {
        if (data[i + 1].y - data[i].y < 50) {
          data[i].y = data[i + 1].y - 50;
        }
      }

      for (let i = middle + 1; i < data.length; i++) {
        if (data[i].y - data[i - 1].y < 50) {
          data[i].y = data[i - 1].y + 50;
        }
      }

      return data;
    }

    const handleTooltip = (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      const xValue = localPoint(event)?.x || 0;
      const index = Math.round(xScale.invert(xValue));

      let tooltipData: IVXTooltipData[] = [];
      for (let i = 0; i < vxData.length; i++) {
        const currentData = vxData[i];
        const { name, color, offset } = currentData;
        const date = index;

        const matchingPoint = currentData.points.find(
          point => point.date === date
        );
        if (!matchingPoint) {
          continue;
        }

        const value = matchingPoint.value;

        tooltipData.push({
          name,
          color,
          offset,
          date: index,
          value,
          y: yScale(value)
        });
      }

      showTooltip({
        tooltipData: tooltipShifter(tooltipData),
        tooltipLeft: xScale(index),
        tooltipTop: 0
      });
    };

    const xScale = scaleLinear({
      range: [0, dims.width],
      domain: [0, DAYS_TO_SHOW - 1]
    });

    let maxY = 0;
    for (let i = 0; i < vxData.length; i++) {
      maxY = Math.max(max(vxData[i].points, y) || 0, maxY);
    }
    let yScale = scaleLinear({
      range: [dims.height, 0],
      domain: [0, maxY],
      nice: true
    });
    if (scale === EScale.Log) {
      yScale = scaleLog({
        range: [dims.height, 0],
        domain: [1, maxY],
        nice: true
      });
    }

    const common = {
      x: (d: IVXDataPoint) => xScale(x(d)),
      y: (d: IVXDataPoint) => yScale(y(d)),
      curve: curveMonotoneX
    };

    const logFormat = (n: number | { valueOf(): number; }, i: number) => {
      let value = typeof n === "number" ? n : n.valueOf();
      return logTicks.has(value) ? format(".2s")(n) : "";
    };
    const axisFormat = scale === EScale.Log ? logFormat : format(".2s");

    return (
      <Measure
        bounds
        onResize={r => {
          r.bounds && setDims(r.bounds);
        }}
      >
        {({ measureRef }) => (
          <div ref={measureRef}>
            <svg width={dims.width} height={300}>
              <AxisLeft
                top={margin.top}
                left={0}
                scale={yScale}
                hideZero
                numTicks={5}
                tickFormat={axisFormat}
                tickStroke="transparent"
                stroke="transparent"
                tickLabelProps={() => ({
                  fill: "var(--gray)",
                  textAnchor: "end",
                  fontSize: 10,
                  dx: "0em",
                  dy: "0.25em"
                })}
                tickComponent={({ formattedValue, ...tickProps }) => (
                  <text {...tickProps}>{formattedValue}</text>
                )}
              />
              <Grid
                top={margin.top}
                left={margin.left}
                xScale={xScale}
                yScale={yScale}
                stroke="var(--gray)"
                opacity={0.1}
                width={xMax}
                height={yMax}
                numTicksRows={5}
                numTicksColumns={10}
              />
              {vxData.map(d => (
                <LinePath
                  key={d.name}
                  stroke={d.color}
                  strokeWidth={3}
                  {...common}
                  data={d.points}
                />
              ))}
              <Bar
                x={0}
                y={0}
                width={dims.width}
                height={300}
                fill="transparent"
                onTouchStart={handleTooltip}
                onTouchMove={handleTooltip}
                onMouseEnter={handleTooltip}
                onMouseMove={handleTooltip}
                onMouseLeave={hideTooltip}
              />
              {tooltipData && (
                <g>
                  <Line
                    from={{ x: tooltipLeft, y: 0 }}
                    to={{ x: tooltipLeft, y: 10000 }}
                    stroke="var(--gray)"
                    strokeWidth={1}
                    style={{ pointerEvents: "none" }}
                    strokeDasharray="2,2"
                  />
                </g>
              )}
            </svg>
            {tooltipData && (
              <div>
                {tooltipData.map(d => {
                  let style = {
                    color: d.color,
                    backgroundColor: "transparent",
                    boxShadow: "none"
                  };
                  if (d.date > 10) {
                    style["transform"] = "translateX(-100%)";
                    style["textAlign"] = "right";
                  }
                  return (
                    <Tooltip
                      key={d.name}
                      top={d.y - 30}
                      left={tooltipLeft}
                      style={style}
                    >
                      <div className="tooltip-desc">
                        <b>{`${d.name}`}</b>
                        <span>{`- ${dayjs("2020-01-21")
                          .add(d.date - d.offset, "day")
                          .format("MMM D")}`}</span>
                      </div>
                      <div className="tooltip-value">{`${d.value}`}</div>
                    </Tooltip>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Measure>
    );
  }
);

const mapStateToProps = (state: AppState) => ({
  regions: state.regions,
  zoom: state.zoom,
  scale: state.scale,
  mode: state.mode
});

export default connect(mapStateToProps)(VX);
