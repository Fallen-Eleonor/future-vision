type Props = {
  current: number
  total: number
}

export function StepProgress({ current, total }: Props) {
  return (
    <div className="step-progress">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`step-dot ${i <= current ? 'done' : ''} ${i === current ? 'active' : ''}`} />
      ))}
      <span className="step-label">
        Step {current + 1} of {total}
      </span>
    </div>
  )
}
