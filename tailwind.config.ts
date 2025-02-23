import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        heliotrope: {
          "50": "#fdf3ff",
          "100": "#fae7ff",
          "200": "#f4ceff",
          "300": "#f0a7ff",
          "400": "#e872ff",
          "500": "#de59f9",
          "600": "#c01ddc",
          "700": "#a214b7",
          "800": "#861395",
          "900": "#70157a",
          "950": "#4b0052",
        },
        "dark-blue": {
          "50": "#f3f3ff",
          "100": "#e9e8ff",
          "200": "#d5d5ff",
          "300": "#b5b2ff",
          "400": "#9187fe",
          "500": "#6d56fc",
          "600": "#5933f4",
          "700": "#4c22df",
          "800": "#421dc5",
          "900": "#351999",
          "950": "#1e0d68",
        },

        numbers: "hsl(var(--numbers))",
        contrast: "hsl(var(--contrast))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        mutedForeground: "var(--muted-foreground)",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;
