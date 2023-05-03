import { useEffect, useState } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { loadFileData, loadFilesList } from '../api'
import {
  TEMPERATURE_CHART_DATA_TEMPLATE,
  HUMIDITY_CHART_DATA_TEMPLATE,
} from '../helpers'
import FileSelector from './FileSelector'
import TemperatureChart from './TemperatureChart'
import HumidityChart from './HumidityChart'

const Charts = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [filesList, setFilesList] = useState([])
  const [currentFileIndex, setCurrentFileIndex] = useState(null)

  const [temperatureChartData, setTemperatureChartData] = useState(
    TEMPERATURE_CHART_DATA_TEMPLATE,
  )
  const [humidityChartData, setHumidityChartData] = useState(
    HUMIDITY_CHART_DATA_TEMPLATE,
  )

  useEffect(() => {
    async function loadFileListAndPrepare() {
      try {
        // TODO: Create dummy data in the website local folder to avoid using absolute paths
        const files = await loadFilesList('http://greenhouse.local/list')
        setFilesList(
          files.map((file, index) => ({
            index,
            file,
            date: new Date(file.split('.')[0]).toLocaleDateString(),
          })),
        )
        setCurrentFileIndex(0)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    loadFileListAndPrepare()
  }, [])

  useEffect(() => {
    async function loadFileDataAndPrepare() {
      if (currentFileIndex == null || !filesList[currentFileIndex]) {
        return
      }

      setIsLoading(true)
      try {
        const jsonData = await loadFileData(
          `http://greenhouse.local/data/${filesList[currentFileIndex].file}`,
        )

        const temperatureChartRecordsList = jsonData.reduce(
          (data, { time, temperature }) => {
            data.labels.push(time)
            data.datasets[0].data.push({ x: time, y: temperature })
            return data
          },
          TEMPERATURE_CHART_DATA_TEMPLATE,
        )
        setTemperatureChartData(temperatureChartRecordsList)

        const humidityChartRecordsList = jsonData.reduce(
          (data, { time, humidity }) => {
            data.labels.push(time)
            data.datasets[0].data.push({ x: time, y: humidity })
            return data
          },
          HUMIDITY_CHART_DATA_TEMPLATE,
        )
        setHumidityChartData(humidityChartRecordsList)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    loadFileDataAndPrepare()
  }, [currentFileIndex])

  if (isLoading) {
    return (
      <section>
        <FileSelector />
        <div className="mt-10">
          <ArrowPathIcon className="mx-auto h-8 w-8 animate-spin text-gray-500" />
        </div>
      </section>
    )
  }

  console.log(
    temperatureChartData.labels.length,
    humidityChartData.labels.length,
  )
  if (
    !filesList.length ||
    !temperatureChartData.labels.length ||
    !humidityChartData.labels.length
  ) {
    return (
      <section>
        <FileSelector />
        <p className="mt-6 text-center italic text-gray-500">Data not found</p>
      </section>
    )
  }

  const handleChange = ({ index }) => setCurrentFileIndex(index)

  return (
    <section>
      <FileSelector
        filesList={filesList}
        currentIndex={currentFileIndex}
        onChange={handleChange}
      />

      <TemperatureChart data={temperatureChartData} />

      <HumidityChart data={humidityChartData} />
    </section>
  )
}

export default Charts
