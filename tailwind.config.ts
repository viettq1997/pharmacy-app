import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {},
  },
  plugins: [],
  important: true,
  corePlugins: {
    preflight: false,
  },
} satisfies Config
