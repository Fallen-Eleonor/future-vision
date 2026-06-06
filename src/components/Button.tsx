import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { NavIconArrow } from './NavIcons'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'md' | 'lg' | 'sm'
  children: ReactNode
  arrow?: boolean
  to?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  arrow = false,
  to,
  ...props
}: Props) {
  const cls = [
    variant === 'primary' ? 'btn-teal' : variant === 'ghost' ? 'btn-teal-ghost' : 'btn-teal-outline',
    size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {children}
      {arrow && <NavIconArrow size={14} />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cls}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={cls} {...props}>
      {content}
    </button>
  )
}
