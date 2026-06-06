import { useMemo } from 'react'
import type { ChartOptions } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { axisTicks, baseScaleBorder, ensureChartsRegistered } from '../lib/chartSetup'
import { DeviceChartFrame } from './DeviceChartFrame'

ensureChartsRegistered()

type Reading = {
  time: string
  value: number
}

type Props = {
  connected: boolean
  compact?: boolean
}

const TARGET_LOW = 70
const TARGET_HIGH = 180
const Y_MIN = 50
const Y_MAX = 220

function buildMockReadings(): Reading[] {
  const now = new Date()
  const readings: Reading[] = []

  for (let i = 23; i >= 0; i--) {
    const t = new Date(now)
    t.setMinutes(t.getMinutes() - i * 15)

    const hour = t.getHours()
    const mealSpike = hour === 8 || hour === 13 || hour === 19 ? 35 : 0
    const wave = Math.sin((23 - i) / 4) * 18
    const noise = ((i * 17) % 11) - 5
    const value = Math.round(95 + wave + mealSpike + noise)

    readings.push({
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Math.min(Y_MAX, Math.max(Y_MIN, value)),
    })
  }

  return readings
}

export function CgmChart({ connected, compact = false }: Props) {
  const readings = useMemo(() => buildMockReadings(), [])
  const latest = readings[readings.length - 1]
  const inRange = latest.value >= TARGET_LOW && latest.value <= TARGET_HIGH

  const labels = readings.map((r) => r.time)
  const values = readings.map((r) => r.value)

  const data = {
    labels,
    datasets: [
      {
        label: 'Glucose',
        data: values,
        borderColor: '#0f766e',
        backgroundColor: 'rgba(13, 148, 136, 0.28)',
        borderWidth: 3,
        pointRadius: values.map((_, i) => (i === values.length - 1 ? (compact ? 4 : 5) : 0)),
        pointBackgroundColor: '#0d9488',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
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
          label: (ctx) => `${ctx.parsed.y} mg/dL`,
        },
      },
      annotation: {
        annotations: {
          targetZone: {
            type: 'box',
            yMin: TARGET_LOW,
            yMax: TARGET_HIGH,
            backgroundColor: 'rgba(5, 150, 105, 0.2)',
            borderColor: 'rgba(5, 150, 105, 0.55)',
            borderWidth: 1,
            borderDash: [5, 4],
          },
        },
      },
    },
    scales: {
      x: {
        ...baseScaleBorder,
        grid: { color: 'rgba(0, 0, 0, 0.08)' },
        ticks: {
          ...axisTicks(compact),
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: compact ? 4 : 6,
        },
      },
      y: {
        ...baseScaleBorder,
        min: Y_MIN,
        max: Y_MAX,
        grid: { color: 'rgba(0, 0, 0, 0.12)' },
        ticks: {
          ...axisTicks(compact),
          stepSize: 30,
          callback: (value) => `${value}`,
        },
      },
    },
  }

  return (
    <DeviceChartFrame
      connected={connected}
      compact={compact}
      title="CGM glucose"
      hint="Continuous glucose · last 6 hours (demo)"
      value={latest.value}
      unit="mg/dL"
      badge={inRange ? 'In range' : 'Out of range'}
      badgeTone={inRange ? 'good' : 'warn'}
      overlayMessage="Connect CGM to sync live readings"
      chartHeight={compact ? 108 : 180}
      legend={
        <>
          <span>
            <i className="device-chart__swatch device-chart__swatch--zone" />
            Target 70–180 mg/dL
          </span>
          <span>
            <i className="device-chart__swatch device-chart__swatch--line-cgm" />
            Glucose trend
          </span>
        </>
      }
    >
      <Line data={data} options={options} />
    </DeviceChartFrame>
  )
}
