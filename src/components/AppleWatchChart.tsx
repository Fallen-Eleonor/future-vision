import { useMemo } from 'react'
import type { ChartOptions } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { appleWatchDemo } from '../lib/deviceMockData'
import { axisTicks, baseScaleBorder, ensureChartsRegistered } from '../lib/chartSetup'
import { DeviceChartFrame } from './DeviceChartFrame'

ensureChartsRegistered()

type Props = {
  connected: boolean
  compact?: boolean
}

const HR_LOW = 50
const HR_HIGH = 120

export function AppleWatchChart({ connected, compact = false }: Props) {
  const demo = useMemo(() => appleWatchDemo, [])
  const calProgress = Math.round((demo.activeCalories / demo.activeCaloriesGoal) * 100)
  const inZone = demo.heartRateNow >= 60 && demo.heartRateNow <= 100

  const data = {
    labels: demo.timeLabels,
    datasets: [
      {
        label: 'Heart rate',
        data: demo.hourlyHeartRate,
        borderColor: '#e11d48',
        backgroundColor: 'rgba(225, 29, 72, 0.18)',
        borderWidth: 2.5,
        pointRadius: demo.hourlyHeartRate.map((_, i) => (i === demo.hourlyHeartRate.length - 1 ? 4 : 0)),
        pointBackgroundColor: '#e11d48',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.35,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0a0a0a',
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} bpm`,
        },
      },
      annotation: {
        annotations: {
          hrZone: {
            type: 'box',
            yMin: 60,
            yMax: 100,
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            borderColor: 'rgba(99, 102, 241, 0.4)',
            borderWidth: 1,
            borderDash: [4, 4],
          },
        },
      },
    },
    scales: {
      x: {
        ...baseScaleBorder,
        grid: { color: 'rgba(0, 0, 0, 0.06)' },
        ticks: {
          ...axisTicks(compact),
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: compact ? 4 : 6,
        },
      },
      y: {
        ...baseScaleBorder,
        min: HR_LOW,
        max: HR_HIGH,
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        ticks: {
          ...axisTicks(compact),
          stepSize: 20,
          callback: (value) => `${value}`,
        },
      },
    },
  }

  return (
    <DeviceChartFrame
      connected={connected}
      compact={compact}
      title="Apple Watch"
      hint="Activity & heart rate · last 24h (demo)"
      value={demo.heartRateNow}
      unit="bpm now"
      badge={inZone ? 'Normal zone' : 'Elevated'}
      badgeTone={inZone ? 'good' : 'warn'}
      overlayMessage="Connect Apple Watch to sync activity"
      chartHeight={compact ? 108 : 180}
      metrics={
        <div className="device-chart__metrics">
          <div className="device-chart__metric">
            <span>Active cal</span>
            <strong>
              {demo.activeCalories}/{demo.activeCaloriesGoal}
            </strong>
          </div>
          <div className="device-chart__metric">
            <span>Exercise</span>
            <strong>
              {demo.exerciseMinutes}/{demo.exerciseGoal} min
            </strong>
          </div>
          <div className="device-chart__metric">
            <span>Stand</span>
            <strong>
              {demo.standHours}/{demo.standGoal} hr
            </strong>
          </div>
          <div className="device-chart__metric">
            <span>Cal goal</span>
            <strong>{calProgress}%</strong>
          </div>
        </div>
      }
      legend={
        <>
          <span>
            <i className="device-chart__swatch device-chart__swatch--zone" />
            Normal 60–100 bpm
          </span>
          <span>
            <i className="device-chart__swatch device-chart__swatch--line-watch" />
            Heart rate
          </span>
        </>
      }
    >
      <Line data={data} options={options} />
    </DeviceChartFrame>
  )
}
