import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

let registered = false

export function ensureChartsRegistered() {
  if (registered) return
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    BarController,
    Filler,
    Tooltip,
    Legend,
    annotationPlugin,
  )
  registered = true
}

export const chartFont = {
  mono: 'JetBrains Mono, ui-monospace, monospace',
  sans: 'Inter, system-ui, sans-serif',
}

export const axisTicks = (compact: boolean) => ({
  color: '#374151',
  font: {
    family: chartFont.mono,
    size: compact ? 9 : 10,
    weight: 600 as const,
  },
})

export const baseScaleBorder = {
  border: { color: 'rgba(0, 0, 0, 0.16)' },
}
