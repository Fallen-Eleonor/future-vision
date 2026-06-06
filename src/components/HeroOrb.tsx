import { HERO_ORB_URL } from '../data/assets'

type Props = {
  size?: 'hero' | 'sm' | 'embedded'
}

export function HeroOrb({ size = 'hero' }: Props) {
  return (
    <div className={`hero-orb hero-orb-${size}`} aria-hidden="true">
      <img src={HERO_ORB_URL} alt="" className="hero-orb-img" draggable={false} />
    </div>
  )
}
