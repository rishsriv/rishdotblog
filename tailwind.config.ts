import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx,md,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          '"SF Pro Display"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            lineHeight: 1.8,
            p: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            'h2 + p': {
              marginTop: '0.75em',
            },
            'blockquote p:first-of-type::before': {
              content: 'none',
            },
            'blockquote p:last-of-type::after': {
              content: 'none',
            },
            pre: {
              borderRadius: '0.5rem',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            img: {
              borderRadius: '0.375rem',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            hr: {
              marginTop: '3rem',
              marginBottom: '3rem',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;
