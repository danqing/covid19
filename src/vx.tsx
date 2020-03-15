import dayjs from "dayjs";
import { bisector, extent, max } from "d3-array";
import React from "react";
import Measure, { BoundingRect } from "react-measure";
import { connect } from "react-redux";

import { Bar, Line, LinePath } from '@vx/shape';
import { curveMonotoneX } from '@vx/curve';
import { GridRows, GridColumns } from '@vx/grid';
import { scaleLinear, scaleLog } from '@vx/scale';
import { withTooltip, Tooltip, TooltipWithBounds } from '@vx/tooltip';
import { WithTooltipProvidedProps } from "@vx/tooltip/lib/enhancers/withTooltip";
import { localPoint } from '@vx/event';

import { AppState, EScale } from "./redux/reducers";

import "./vx.css";

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

interface IVXProps {

}

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

type TVXProps = IVXProps & IVXProvidedProps & ReturnType<typeof mapStateToProps>;

const VX = withTooltip<TVXProps, IVXTooltipData[]>(({
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipTop = 0,
  tooltipLeft = 0,
}: TVXProps & WithTooltipProvidedProps<IVXTooltipData[]>) => {

    const [dims, setDims] = React.useState<BoundingRect>({
      top: 0, left: 0, bottom: 0, right: 0, width: 100, height: 100,
    });

    const yMax = dims.height - margin.top - margin.bottom;

    const handleTooltip = (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>,
    ) => {
      const xValue = localPoint(event)?.x || 0;
      const index = Math.round(xScale.invert(xValue));
      let tooltipData: IVXTooltipData[] = [];
      for (let i = 0; i < data.length; i++) {
        const value = y(data[i].points[index - 1]);
        tooltipData.push({
          name: data[i].name,
          color: data[i].color,
          offset: data[i].offset,
          date: index,
          value,
          y: yScale(value),
        })
      }

      showTooltip({
        tooltipData,
        tooltipLeft: xScale(index),
        tooltipTop: 0,
      });
    };

    const data: IVXDataSeries[] = [{
      name: "United States",
      color: "#ff6348",
      offset: 10,
      points: [
        {date: 1, value: 2},
        {date: 2, value: 13},
        {date: 3, value: 4},
        {date: 4, value: 4},
        {date: 5, value: 7},
        {date: 6, value: 15},
        {date: 7, value: 3},
        {date: 8, value: 2},
        {date: 9, value: 8},
        {date: 10, value: 4},
      ],
    }, {
      name: "Italy",
      color: "#1e90ff",
      offset: 5,
      points: [
        {date: 1, value: 12},
        {date: 2, value: 5},
        {date: 3, value: 3},
        {date: 4, value: 7},
        {date: 5, value: 8},
        {date: 6, value: 2},
        {date: 7, value: 6},
        {date: 8, value: 2},
        {date: 9, value: 5},
        {date: 10, value: 6},
      ],
    }]

    const xScale = scaleLinear({
      range: [0, dims.width],
      domain: [1, 10],
    });

    let maxY = 0;
    for (let i = 0; i < data.length; i++) {
      maxY = Math.max(max(data[i].points, y) || 0, maxY);
    }
    const yScale = scaleLinear({
      range: [dims.height, 0],
      domain: [0, maxY * 6 / 5],
      nice: true
    });

    const common = {
      x: (d: IVXDataPoint) => xScale(x(d)),
      y: (d: IVXDataPoint) => yScale(y(d)),
      curve: curveMonotoneX,
    };

    return (
      <Measure bounds onResize={r => {r.bounds && setDims(r.bounds);}}>
        {({ measureRef }) =>
          <div ref={measureRef}>
            <svg width={dims.width} height={300}>
              {data.map(d =>
                <LinePath key={d.name} stroke={d.color} strokeWidth={3}
                  {...common} data={d.points}/>
              )}
              <Bar
                x={0}
                y={0}
                width={dims.width}
                height={200}
                fill='transparent'
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
                {tooltipData.map(d =>
                  <Tooltip
                    key={d.name}
                    top={d.y - 20}
                    left={tooltipLeft}
                    style={{
                      color: d.color,
                      backgroundColor: "transparent",
                      boxShadow: "none"
                    }}
                  >
                    <div className="tooltip-desc">{`${d.name}`}</div>
                    <div className="tooltip-value">{`${d.value}`}</div>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        }
      </Measure>
    );
  },
);

const mapStateToProps = (state: AppState) => ({
  regions: state.regions,
  zoom: state.zoom,
  scale: state.scale
});

export default connect(mapStateToProps)(VX);
