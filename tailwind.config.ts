import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0ec2bc",
          50: "#E6F8F7",
          100: "#CCF1F0",
          200: "#99E3E1",
          300: "#66D5D2",
          400: "#33C7C3",
          500: "#0ec2bc",
          600: "#0BA09A",
          700: "#087E78",
          800: "#065C56",
          900: "#033A34",
        },
        background: "#0A0F1A",
        foreground: "#FFFFFF",
        muted: {
          DEFAULT: "#64748B",
          foreground: "#94A3B8",
        },
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'cinzel-decorative': ['Cinzel Decorative', 'serif'],
        'montserrat-alt': ['Montserrat Alternates', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cosmic-gradient": "linear-gradient(135deg, #0A0F1A 0%, #1A1F2E 50%, #0A0F1A 100%)",
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(14, 194, 188, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(14, 194, 188, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
