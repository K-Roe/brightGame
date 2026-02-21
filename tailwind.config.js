/** @type {import('tailwindcss').Config} */
module.exports = {
  // Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
            "primary": "#1E40AF",
            "secondary": "#FBBF24",
            light: {
                100: "#E0E7FF",
                200: "#C7D2FE",
                300: "#A5B4FC",
                400: "#818CF8",
                500: "#6366F1",
                600: "#4F46E5",
                700: "#4338CA",
            },
            dark: {
                100: "#1E3A8A",
                200: "#1E40AF",
                300: "#1D4ED8",
                400: "#1E40AF",
                500: "#1E3A8A",
                600: "#1E40AF",
                700: "#1D4ED8",
            },
            "accent": "#10B981",
            "background": "#F3F4F6",
            "text": "#111827",
        },

    },
  },
  plugins: [],
};