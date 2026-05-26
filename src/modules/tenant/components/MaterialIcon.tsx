import type { CSSProperties } from 'react'

interface MaterialIconProps {
  name: string
  filled?: boolean
  className?: string
  style?: CSSProperties
}

export function MaterialIcon({ name, filled = false, className, style }: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ''}`}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
        ...style,
      }}
    >
      {name}
    </span>
  )
}
