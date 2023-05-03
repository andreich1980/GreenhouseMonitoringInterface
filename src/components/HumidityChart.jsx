import { useEffect, useRef, useState } from 'react'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { COLORS } from '../helpers'

const HumidityChart = ({ data }) => {
  const chartContainerRef = useRef(null)

  const [chartOptions, setChartOptions] = useState({})
  const [chartWidth, setChartWidth] = useState('100%')

  useEffect(() => {
    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            callback: (value, index) =>
              index % 2 === 0 ? data.labels[value] : '',
          },
        },
        humidity: {
          title: {
            display: true,
            text: 'Humidity, %',
            color: COLORS.HUMIDITY,
          },
          type: 'linear',
          display: true,
          position: 'left',
          grace: '5%',
          border: { color: COLORS.HUMIDITY },
          ticks: {
            color: COLORS.HUMIDITY,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        decimation: { enabled: true, algorith: 'min-max' },
        legend: { display: false },
      },
    })

    setChartWidth(
      data.labels.length > 15 ? data.labels.length * 30 + 'px' : '100%',
    )
  }, [data.labels.length])

  useEffect(() => {
    chartContainerRef.current.scrollLeft = chartContainerRef.current.scrollWidth
  }, [chartContainerRef.current])

  Chart.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    PointElement,
    LineElement,
  )

  return (
    <>
      <h2 className="text-center text-lg font-semibold">Humidity</h2>
      <div ref={chartContainerRef} className="w-full overflow-x-auto">
        <div className="mx-auto h-96" style={{ width: chartWidth }}>
          <Line data={data} options={chartOptions} />
        </div>
      </div>
    </>
  )
}

export default HumidityChart
