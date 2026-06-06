import type { ReactNode } from 'react'

type Props = {
  connected: boolean
  compact?: boolean
  title: string
  hint: string
  value: string | number
  unit: string
  badge?: string
  badgeTone?: 'good' | 'warn'
  overlayMessage: string
  legend: ReactNode
  chartHeight: number
  metrics?: ReactNode
  children: ReactNode
}

export function DeviceChartFrame({
  connected,
  compact = false,
  title,
  hint,
  value,
  unit,
  badge,
  badgeTone = 'good',
  overlayMessage,
  legend,
  chartHeight,
  metrics,
  children,
}: Props) {
  return (
    <div
      className={`device-chart ${connected ? '' : 'device-chart--disconnected'} ${compact ? 'device-chart--compact' : ''}`}
    >
      <div className="device-chart__header">
        <div>
          <h2 className="card-title">{title}</h2>
          <p className="hint">{hint}</p>
        </div>
        <div className="device-chart__current">
          <span className="device-chart__value">{value}</span>
          <span className="device-chart__unit">{unit}</span>
          {badge && (
            <span className={`device-chart__badge ${badgeTone === 'good' ? 'in-range' : 'out-range'}`}>
              {badge}
            </span>
          )}
        </div>
      </div>

      {metrics}

      <div className="device-chart__canvas">
        <div className="device-chart__chart" style={{ height: chartHeight }}>
          {children}
        </div>
        {!connected && (
          <div className="device-chart__overlay">
            <p>{overlayMessage}</p>
          </div>
        )}
      </div>

      <div className="device-chart__legend">{legend}</div>
    </div>
  )
}
