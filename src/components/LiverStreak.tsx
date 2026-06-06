type Props = {
  days: boolean[]
}

const liverShape = [
  0, 1, 1, 1, 0, 0, 0,
  1, 1, 1, 1, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1,
  0, 1, 1, 1, 1, 1, 0,
  0, 0, 1, 1, 1, 0, 0,
]

export function LiverStreak({ days }: Props) {
  const cells = liverShape.map((slot, i) => ({
    slot,
    active: slot ? days[i] ?? false : null,
    key: i,
  }))

  const streak = days.filter(Boolean).length

  return (
    <div className="liver-streak">
      <div className="liver-streak-header">
        <h3>Adherence streak</h3>
        <span>{streak} active days</span>
      </div>
      <p className="liver-note">
        A gamified metaphor — not a measurement of your actual liver. Brightens with daily adherence.
      </p>
      <div className="liver-grid">
        {cells.map(({ slot, active, key }) =>
          slot === 0 ? (
            <span key={key} className="liver-cell empty" />
          ) : (
            <span
              key={key}
              className={`liver-cell ${active ? 'active' : 'broken'}`}
              title={active ? 'Adhered' : 'Missed'}
            />
          ),
        )}
      </div>
    </div>
  )
}
