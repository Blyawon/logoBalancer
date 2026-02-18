import tallMarkSvg from '@/assets/logos/tall-mark.svg'
import figmaSvg from '@/assets/logos/figma.svg'
import airbnbSvg from '@/assets/logos/airbnb.svg'
import stripeSvg from '@/assets/logos/stripe.svg'
import wideMarkSvg from '@/assets/logos/wide-mark.svg'

export interface LogoMeta {
  id: string
  name: string
  ratio: number // naturalWidth / naturalHeight
  src: string
}

export const LOGOS: LogoMeta[] = [
  { id: 'stripe', name: 'Stripe', ratio: 2.393, src: stripeSvg },
  { id: 'tall-mark', name: 'Tall', ratio: 0.35, src: tallMarkSvg },
  { id: 'airbnb', name: 'Airbnb', ratio: 0.929, src: airbnbSvg },
  { id: 'wide-mark', name: 'Wide', ratio: 5.0, src: wideMarkSvg },
  { id: 'figma', name: 'Figma', ratio: 0.675, src: figmaSvg },
]
