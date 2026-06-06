import { useMemo } from 'react'
import type { ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { appleHealthDemo } from '../lib/deviceMockData'
import { axisTicks, baseScaleBorder, ensureChartsRegistered } from '../lib/chartSetup'
import { DeviceChartFrame } from './DeviceChartFrame'

ensureChartsRegistered()

type Props = {
  connected: boolean
  compact?: boolean
}

export function AppleHealthChart({ connected, compact = false }: Props) {
  const demo = useMemo(() => appleHealthDemo, [])
  const stepsProgress = Math.round((demo.stepsToday / demo.stepsGoal) * 100)

  const data = {
    labels: demo.dayLabels,
    datasets: [
      {
        label: 'Steps',
        data: demo.weeklySteps,
        backgroundColor: demo.weeklySteps.map((steps) =>
          steps >= demo.stepsGoal ? 'rgba(5, 150, 105, 0.75)' : 'rgba(99, 102, 241, 0.65)',
        ),
        borderColor: demo.weeklySteps.map((steps) =>
          steps >= demo.stepsGoal ? '#059669' : '#4f46e5',
        ),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0a0a0a',
        callbacks: {
          label: (ctx) => `${ctx.parsed.y?.toLocaleString()} steps`,
        },
      },
      annotation: {
        annotations: {
          stepsGoal: {
            type: 'line',
            yMin: demo.stepsGoal,
            yMax: demo.stepsGoal,
            borderColor: 'rgba(217, 119, 6, 0.8)',
            borderWidth: 2,
            borderDash: [6, 4],
            label: {
              display: true,
              content: `Goal ${demo.stepsGoal.toLocaleString()}`,
              position: 'end',
              backgroundColor: 'rgba(217, 119, 6, 0.9)',
              color: '#fff',
              font: { size: 9, weight: 'bold' },
            },
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
        },
      },
      y: {
        ...baseScaleBorder,
        min: 0,
        max: 12000,
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        ticks: {
          ...axisTicks(compact),
          stepSize: 3000,
          callback: (value) => `${Number(value) / 1000}k`,
        },
      },
    },
  }

  return (
    <DeviceChartFrame
      connected={connected}
      compact={compact}
      title="Apple Health"
      hint="Daily vitals · 7-day steps (demo)"
      value={demo.stepsToday.toLocaleString()}
      unit="steps today"
      badge={`${stepsProgress}% of goal`}
      badgeTone={stepsProgress >= 80 ? 'good' : 'warn'}
      overlayMessage="Connect Apple Health to sync vitals"
      chartHeight={compact ? 108 : 180}
      metrics={
        <div className="device-chart__metrics">
          <div className="device-chart__metric">
            <span>Sleep</span>
            <strong>{demo.sleepHours}h</strong>
          </div>
          <div className="device-chart__metric">
            <span>Resting HR</span>
            <strong>{demo.restingHr} bpm</strong>
          </div>
          <div className="device-chart__metric">
            <span>HRV</span>
            <strong>{demo.hrv} ms</strong>
          </div>
          <div className="device-chart__metric">
            <span>Weight</span>
            <strong>{demo.weightKg} kg</strong>
          </div>
        </div>
      }
      legend={
        <>
          <span>
            <i className="device-chart__swatch device-chart__swatch--goal" />
            Goal {demo.stepsGoal.toLocaleString()} steps
          </span>
          <span>
            <i className="device-chart__swatch device-chart__swatch--bar" />
            Daily steps
          </span>
        </>
      }
    >
      <Bar data={data} options={options} />
    </DeviceChartFrame>
  )
}
