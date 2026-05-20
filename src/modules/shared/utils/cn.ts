import { clsx, type ClassValue } from 'clsx'

/**
 * Utility for conditionally joining Tailwind CSS class names.
 * Wraps clsx for consistent usage across the app.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-primary-100', className)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
