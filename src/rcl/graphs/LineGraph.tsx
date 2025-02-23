import Plot from 'react-plotly.js'
import { DataSeries } from './graphs';


interface Props {
  series: DataSeries;
  xLabel?: string;
  yLabel?: string;
  className?: string;
  color: string;
}

const LineGraph = ({ series, xLabel, yLabel, color }: Props) => {

  const layout = {
    title: series.analysis,
    uirevision: 'true',
    xaxis: {
      title: {
        text: xLabel,
        font: {
          size: 16,
          color: "#7f7f7f",
        },
      },
    },
    yaxis: {
      title: {
        text: yLabel,
        font: {
          size: 16,
          color: "#7f7f7f",
        },
      },
    },
  }

  return (< div className='w-full' >
    <Plot
      data={[
        {
          x: series.data.map(({ x }) => x),
          y: series.data.map(({ y }) => y),
          line: { color: color },
          name: "deploys",
          type: "scatter",
          mode: "lines",
          hovertemplate: `${xLabel}: %{x}<br>${yLabel}: %{y}<extra></extra>`
        }
      ]}
      useResizeHandler={true}
      layout={layout}
      style={{ width: "100%", height: "100%" }}
      config={{ responsive: true }}
    />
  </div >);
};

export default LineGraph;
