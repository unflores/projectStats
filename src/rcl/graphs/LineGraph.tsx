import Plot from 'react-plotly.js'

type Line = {
  id: string;
  color: string;
  data: {
    x: string | number;
    y: number;
  }[];
};

interface Props {
  line: Line;
  xLabel?: string;
  yLabel?: string;
  className?: string;
}

const LineGraph = ({ line, xLabel, yLabel }: Props) => {

  const layout = {
    title: line.id,
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
          x: line.data.map(({ x }) => x),
          y: line.data.map(({ y }) => y),
          line: { color: line.color },
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
