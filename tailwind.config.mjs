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
        // *************************************************************
        // 💡 [폰트 통일화 핵심 설정] 
        // font-sans 클래스가 나눔 명조 폰트 변수를 사용하도록 재정의합니다.
        // *************************************************************
        sans: ['var(--font-nanum-myeongjo)', ...fontFamily.sans], 
        // 나눔 명조를 모든 기본 폰트(sans)로 사용
        // *************************************************************
      },
      colors: {
        // 다크 모드 및 라이트 모드 색상 설정 유지
        primary: {
          DEFAULT: "hsl(350 70% 60%)", 
          foreground: "hsl(0 0% 100%)",
          dark: "hsl(210 40% 96%)", 
        },
        // ... 기타 색상 설정 유지
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};