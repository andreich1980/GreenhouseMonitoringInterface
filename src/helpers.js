export const COLORS = {
  TEMPERATURE: '#dc2626',
  HUMIDITY: '#0ea5e9',
}

/**
 * Sort the given array of file names in descending order
 * by the date from the filename.
 * @param {array} array ["2023-03-16.jsonl", ...]
 */
export const sortDesc = (array) => {
  return array.sort(
    (a, b) => new Date(b.split('.')[0]) - new Date(a.split('.')[0]),
  )
}

/**
 * Add leading zero to he given number
 * @param {Number} value
 * @returns {String}
 */
export const leadingZero = (value) => ('0' + value).slice(-2)

export const TEMPERATURE_CHART_DATA_TEMPLATE = {
  labels: [],
  datasets: [
    {
      label: 'Temperature',
      data: [],
      borderColor: COLORS.TEMPERATURE,
      borderWidth: 2,
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.9,
      yAxisID: 'temperature',
    },
  ],
}

export const HUMIDITY_CHART_DATA_TEMPLATE = {
  labels: [],
  datasets: [
    {
      label: 'Humidity',
      data: [],
      borderColor: COLORS.HUMIDITY,
      borderWidth: 2,
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.9,
      yAxisID: 'humidity',
    },
  ],
}

export const getHumidityChartOptions = (xAxisLabels) => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        callback: (value, index) => (index % 2 === 0 ? xAxisLabels[value] : ''),
      },
    },
    humidity: {
      title: { display: true, text: 'Humidity, %', color: COLORS.HUMIDITY },
      type: 'linear',
      display: true,
      position: 'right',
      grid: { drawOnChartArea: false },
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
