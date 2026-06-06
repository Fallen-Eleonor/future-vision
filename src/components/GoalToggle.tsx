import { Check } from 'lucide-react'

type Props = {
  title: string
  done: boolean
  onToggle: () => void
}

export function GoalToggle({ title, done, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`goal-toggle ${done ? 'goal-toggle--done' : ''}`}
      onClick={onToggle}
      aria-pressed={done}
    >
      <span className="goal-toggle__check" aria-hidden="true">
        {done && <Check size={14} strokeWidth={2.5} />}
      </span>
      <span className="goal-toggle__label">{title}</span>
      <span className="goal-toggle__status">{done ? 'Done' : 'Today'}</span>
    </button>
  )
}
