/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sand: "#f8f5ef",
        coral: "#f97360",
        teal: "#14b8a6",
        gold: "#f5b942"
      },
      boxShadow: {
        glow: "0 20px 45px rgba(15, 23, 42, 0.12)"
      },
      fontFamily: {
        sans: ["Sora", "ui-sans-serif", "system-ui"],
        display: ["Clash Display", "Sora", "ui-sans-serif", "system-ui"]
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(20,184,166,0.2), transparent 30%), radial-gradient(circle at top right, rgba(249,115,96,0.22), transparent 28%), linear-gradient(135deg, #fffdf7 0%, #f5efe2 100%)"
      }
    }
  },
  plugins: []
};
