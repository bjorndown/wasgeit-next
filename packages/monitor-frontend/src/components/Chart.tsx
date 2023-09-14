import * as echarts from 'echarts'
import { onMount } from 'solid-js'

export const Chart = ({
  venueStats,
}: {
  venueStats: Record<string, number>
}) => {
  let chartDom: HTMLElement | undefined

  onMount(() => {
    if (!chartDom) {
      throw new Error('ref is null')
    }
    const myChart = echarts.init(chartDom)
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: Object.keys(venueStats),
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: { rotate: 90 },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Events',
          type: 'bar',
          barWidth: '60%',
          data: Object.values(venueStats),
        },
      ],
    }

    myChart.setOption(option)
  })

  // @ts-ignore
  return <div style={{ width: '100%', height: '400px' }} ref={chartDom}></div>
}
