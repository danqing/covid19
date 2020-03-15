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

interface IVXData {
  date: number;
  value: number;
}

const x = (d: IVXData) => d.date;
const y = (d: IVXData) => d.value;

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

}

type TVXProps = IVXProps & IVXProvidedProps & ReturnType<typeof mapStateToProps>;

const VX = withTooltip<TVXProps, IVXData>(
  ({
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: TVXProps & WithTooltipProvidedProps<IVXData>) => {

    const [dims, setDims] = React.useState<BoundingRect>({
      top: 0, left: 0, bottom: 0, right: 0, width: 100, height: 100,
    });

    const yMax = dims.height - margin.top - margin.bottom;

    const handleTooltip = (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>,
    ) => {
      const xValue = localPoint(event)?.x || 0;
      const index = Math.round(xScale.invert(xValue));
      const d = data[index - 1];
      showTooltip({
        tooltipData: d,
        tooltipLeft: xScale(x(d)),
        tooltipTop: yScale(y(d)),
      });
    };

    const data: IVXData[] = [{date: 1, value: 2}, {date: 2, value: 13}, {date: 3, value: 4}];

    const xScale = scaleLinear({
      range: [0, dims.width],
      domain: extent(data, x) as number[],
    });

    const yScale = scaleLinear({
      range: [dims.height, 0],
      domain: [0, (max(data, y) || 0) + dims.height / 3],
      nice: true
    });

    const common = {
      data,
      x: (d: IVXData) => xScale(x(d)),
      y: (d: IVXData) => yScale(y(d)),
      curve: curveMonotoneX,
    };

    return (
      <Measure bounds onResize={r => {r.bounds && setDims(r.bounds);}}>
        {({ measureRef }) =>
          <div ref={measureRef}>
            <svg width={dims.width} height={200}>
              <LinePath stroke="#fffd" strokeWidth={2} {...common}/>
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
                    stroke="rgba(255, 255, 255, 0.5)"
                    strokeWidth={1}
                    style={{ pointerEvents: "none" }}
                    strokeDasharray="2,2"
                  />
                </g>
              )}
            </svg>
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
