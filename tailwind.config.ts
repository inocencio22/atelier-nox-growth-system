import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10120f",
        paper: "#f8f7f1",
        mist: "#eceee8",
        line: "#d8d5ca",
        blue: "#255cff",
        acid: "#c6ff00",
        coral: "#ff4f3e",
        violet: "#8d55ff",
        cyan: "#00c2ff",
        yellow: "#ffd600",
        green: "#00b86b"
      },
      boxShadow: {
        soft: "0 12px 35px rgba(16, 18, 15, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
