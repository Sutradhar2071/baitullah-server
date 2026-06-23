/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0E4D45",
          dark: "#0A3934",
          light: "#15695F",
        },
        accent: {
          DEFAULT: "#D4A55C",
          dark: "#B8893F",
          light: "#E6C385",
        },
        sand: "#FAF7F0",
        sage: "#E8EDE5",
        ink: "#1F2421",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "arch-pattern":
          "radial-gradient(circle at 50% 120%, rgba(212,165,92,0.15), transparent 60%)",
      },
    },
  },
  plugins: [],
};
