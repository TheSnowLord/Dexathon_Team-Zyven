/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F5F6F8",
        ink: {
          DEFAULT: "#14171F",
          muted: "#4A5268",
          subtle: "#7E88A0",
        },
        primary: {
          DEFAULT: "#2B3F8C",
          hover: "#213271",
          subtle: "#EAEFFC",
        },
        status: {
          meets: "#1F7A4D",
          "meets-bg": "#E9F5EF",
          verify: "#A9690F",
          "verify-bg": "#FDF4E7",
          unmet: "#A13A2E",
          "unmet-bg": "#FDF0EE",
        },
        border: {
          DEFAULT: "#E2E4EA",
          subtle: "#ECEEF2",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8F9FA",
          elevated: "#FFFFFF",
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Public Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        elevation: "0 4px 12px rgba(20, 23, 31, 0.08)",
      }
    },
  },
  plugins: [],
}
