import type { NamingConventionId } from './types'

const TSHIRT_NAMES = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', '10xl', '11xl', '12xl', '13xl', '14xl']
const SEMANTIC_NAMES = ['micro', 'tiny', 'small', 'compact', 'base', 'comfortable', 'spacious', 'loose', 'generous', 'vast', 'ultra', 'mega', 'supreme', 'colossal', 'immense', 'enormous', 'monumental', 'epic', 'titanic', 'cosmic']
const FIBONACCI_SEQ = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946]

function centerSlice<T>(arr: T[], count: number): T[] {
  if (count >= arr.length) return arr.slice(0, count)
  const mid = Math.floor(arr.length / 2)
  const start = Math.max(0, mid - Math.floor(count / 2))
  return arr.slice(start, start + count)
}

export function getTokenName(
  index: number,
  steps: number,
  convention: NamingConventionId,
  customNames?: string[],
): string {
  switch (convention) {
    case 'tshirt':
      return centerSlice(TSHIRT_NAMES, steps)[index] ?? `${index}`
    case 'numeric':
      return `${(index + 1) * 100}`
    case 'ordinal':
      return `${index + 1}`
    case 'semantic':
      return centerSlice(SEMANTIC_NAMES, steps)[index] ?? `${index}`
    case 'tailwind': {
      // Tailwind-style fractional naming: 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8...
      const tailwindKeys = ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20']
      return tailwindKeys[index] ?? `${index}`
    }
    case 'fibonacci':
      return `${FIBONACCI_SEQ[index] ?? index}`
    case 'custom':
      return customNames?.[index] ?? `token-${index}`
    default:
      return `${index}`
  }
}

export const NAMING_OPTIONS: { id: NamingConventionId; label: string; example: string }[] = [
  { id: 'tshirt', label: 'T-Shirt', example: 'xs, sm, md, lg, xl' },
  { id: 'numeric', label: 'Numeric', example: '100, 200, 300...' },
  { id: 'ordinal', label: 'Ordinal', example: '1, 2, 3, 4, 5...' },
  { id: 'semantic', label: 'Semantic', example: 'compact, base, spacious' },
  { id: 'tailwind', label: 'Tailwind', example: '0.5, 1, 1.5, 2...' },
  { id: 'fibonacci', label: 'Fibonacci', example: '1, 2, 3, 5, 8, 13' },
  { id: 'custom', label: 'Custom', example: 'your names' },
]
