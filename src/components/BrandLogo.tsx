export function BrandLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <span className={`brand-logo-icon brand-logo-icon--${size}`} aria-hidden="true">
      <span className="brand-logo-gradient" />
    </span>
  )
}

export function ArrowUpRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M7 17L17 7M7 7h10v10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
