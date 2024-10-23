/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        gabi1: {
          "primary": "#00c1df",
          "secondary": "#da68bd",
          "accent": "#00faff",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
        },
        gabi2: {
          "primary": "#0e5378",
          "secondary": "#60a5fa",
          "accent": "#f472b6",
          "neutral": "#3d4451",
          "base-100": "#103039",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        gabi3: { // yellow accent
          "neutral": "#3D4351",
          "base-100": "#323743",
          "primary": "#293457",
          "secondary": "#6C93EF",
          "accent": "#efc86c",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        gabi4: { // pink accent
          "neutral": "#3D4351",
          "base-100": "#323743",
          "primary": "#293457",
          "secondary": "#6C93EF",
          "accent": "#F471B5",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      "light",
      "dark",
      "cupcake",
      "coffee",
    ],
  },
}

