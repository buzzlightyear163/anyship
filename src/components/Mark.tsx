// AnyShip-märket: en app-ikon som är halvt ritning (streckad), halvt färdig (solid), med den blå bygglinjen emellan.
interface Props {
  size?: number
  className?: string
  title?: string
}

export function Mark({ size = 24, className = '', title }: Props) {
  return (
    <svg
      className={`mark ${className}`}
      width={(size * 168) / 196}
      height={size}
      viewBox="16 2 168 196"
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path
        d="M87 24H60A36 36 0 0 0 24 60V140A36 36 0 0 0 60 176H87"
        stroke="currentColor"
        strokeWidth="16"
        strokeDasharray="24 13.18"
      />
      <rect x="93" y="2" width="14" height="196" fill="var(--blue, #3E64FF)" />
      <path d="M113 16H140A44 44 0 0 1 184 60V140A44 44 0 0 1 140 184H113Z" fill="currentColor" />
    </svg>
  )
}
