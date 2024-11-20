import { ResponsiveLine } from '@nivo/line'


type Line = {
  id: string;
  color: string;
  data: {
    x: string | number;
    y: number;
  }[];
};

interface Props {
  lines: Line[];
  xLabel?: string;
  yLabel?: string;
  className?: string;
}

const LineGraph = ({ lines, className, xLabel, yLabel }: Props) => {
  const avg = lines[0].data.reduce((sum, atts) => atts.y + sum, 0) / lines[0].data.length

  return (< div className={className} >
    <ResponsiveLine
      markers={[{
        axis: 'y',
        value: avg.toFixed(2),
        lineStyle: { stroke: '#b0b0b0', strokeWidth: 2, zIndex: 99999 },
        legend: `Mean ${avg.toFixed(2)}`,
        legendPosition: 'top-right',

      }]}
      layers={['grid', 'axes', 'areas', 'crosshair', 'lines', 'markers', 'points', 'slices', 'mesh', 'legends']}
      data={lines}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: xLabel,
        legendOffset: 36,
        legendPosition: 'middle',
        truncateTickAt: 0
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yLabel,
        legendOffset: -40,
        legendPosition: 'middle',
        truncateTickAt: 0
      }}


      lineWidth={6}
      pointSize={8}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="data.yFormatted"
      pointLabelYOffset={-12}
      enableArea={false}

      enableTouchCrosshair={true}
      useMesh={false}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
        }
      ]}
    />
  </div >);
};

export default LineGraph;
