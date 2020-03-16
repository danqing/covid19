import dayjs from "dayjs";
import { max } from "d3-array";
import React from "react";
import Measure, { BoundingRect } from "react-measure";
import { connect } from "react-redux";
import _ from "lodash";
import { format } from "d3-format";

import { AxisLeft } from "@vx/axis";
import { Grid } from '@vx/grid';
import { Bar, Line, LinePath } from "@vx/shape";
import { curveMonotoneX } from "@vx/curve";
import { scaleLinear, scaleLog } from "@vx/scale";
import { Tooltip, withTooltip } from "@vx/tooltip";
import { WithTooltipProvidedProps } from "@vx/tooltip/lib/enhancers/withTooltip";
import { localPoint } from "@vx/event";

import { AppState, EScale } from "./redux/reducers";

import "./vx.css";
import { ModeToAllCountryData } from "./redux/mode";
import { hashCode } from "./util";

const range = (n: number): number[] => Array.from(Array(n).keys());

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

    const handleTooltip = (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      const xValue = localPoint(event)?.x || 0;
      const index = Math.round(xScale.invert(xValue));
      let tooltipData: IVXTooltipData[] = [];
      for (let i = 0; i < vxData.length; i++) {
        if (index >= vxData[i].points.length) {
          continue;
        }
        const value = y(vxData[i].points[index]);
        tooltipData.push({
          name: vxData[i].name,
          color: vxData[i].color,
          offset: vxData[i].offset,
          date: index,
          value,
          y: yScale(value)
        });
      }

      showTooltip({
        tooltipData,
        tooltipLeft: xScale(index),
        tooltipTop: 0
      });
    };

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
        .filter(point => point.value != null);

      vxData.push({
        name: country,
        color: `var(--series-color-${hashCode(country) % 8})`,
        offset: 10,
        points
      });
    });

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
      domain: [0, (maxY * 6) / 5],
      nice: true
    });
    if (scale === EScale.Log) {
      yScale = scaleLog({
        range: [dims.height, 0],
        domain: [1, (maxY * 6) / 5],
        nice: true
      });
    }

    const common = {
      x: (d: IVXDataPoint) => xScale(x(d)),
      y: (d: IVXDataPoint) => yScale(y(d)),
      curve: curveMonotoneX
    };

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
                stroke="var(--gray)"
                tickStroke="var(--gray)"
                tickFormat={format(".2s")}
                tickLabelProps={() => ({
                  fill: 'var(--gray)',
                  textAnchor: 'end',
                  fontSize: 10,
                  dx: '-0.25em',
                  dy: '0.25em'
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
                    to={{ x: tooltipLeft, y: yMax }}
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
                {tooltipData.map(d => (
                  <Tooltip
                    key={d.name}
                    top={d.y - 30}
                    left={tooltipLeft}
                    style={{
                      color: d.color,
                      backgroundColor: "transparent",
                      boxShadow: "none"
                    }}
                  >
                    <div className="tooltip-desc">
                      <b>{`${d.name}`}</b>
                      <span>{`- ${dayjs("2020-01-21").add(d.date + d.offset, "day").format("MMM D")}`}</span>
                    </div>
                    <div className="tooltip-value">{`${d.value}`}</div>
                  </Tooltip>
                ))}
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
