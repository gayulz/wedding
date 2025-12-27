/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  // 다크 모드 활성화 설정
  darkMode: ["class"], 
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['GowunDodum', 'sans-serif'],
        heading: ['TwaySky', 'GowunDodum', 'sans-serif'],
      },
      colors: {
        // 커스텀 웨딩 색상 팔레트
        wedding: {
          gold: "#ffbe53",      // 골드/노란색 - 하이라이트, 액센트
          lime: "#a6b550",      // 연두색 - 보조 강조
          green: "#58a166",     // 초록색 - 주 색상, 버튼
          teal: "#148677",      // 청록색 - 강조
          blue: "#146772",      // 청록-블루 - 카운터
          navy: "#2f4858",      // 네이비 - 텍스트, 다크 배경
        },
        // 기본 테마 색상을 커스텀 팔레트로 재정의
        border: "#a6b550",
        input: "#a6b550",
        ring: "#58a166",
        background: "hsl(0 0% 100%)",
        foreground: "#2f4858",
        primary: {
          DEFAULT: "#58a166",
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "#a6b550",
          foreground: "#2f4858",
        },
        accent: {
          DEFAULT: "#ffbe53",
          foreground: "#2f4858",
        },
        muted: {
          DEFAULT: "hsl(210 40% 96%)",
          foreground: "#2f4858",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "#2f4858",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "#2f4858",
        },
        destructive: {
          DEFAULT: "hsl(0 84% 60%)",
          foreground: "hsl(0 0% 98%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "heartbeat": {
          "0%, 100%": { transform: "scale(1)" },
          "10%, 30%": { transform: "scale(0.9)" },
          "20%, 40%, 60%, 80%": { transform: "scale(1.1)" },
          "50%, 70%": { transform: "scale(1.05)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "float": "float 3s ease-in-out infinite",
        "heartbeat": "heartbeat 1.5s ease-in-out infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};