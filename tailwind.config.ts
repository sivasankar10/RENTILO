import type { Config } from 'tailwindcss'
import { rentiloTailwindExtend } from './src/styles/theme'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: rentiloTailwindExtend,
  },
  plugins: [],
}

export default config
