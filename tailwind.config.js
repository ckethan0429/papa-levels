/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        ember: "var(--ember)",
        mist: "var(--mist)",
        lime: "var(--lime)",
        plum: "var(--plum)"
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"]
      },
      boxShadow: {
        panel: "0 18px 48px rgba(12, 24, 46, 0.14)",
        card: "0 10px 30px rgba(12, 24, 46, 0.08)"
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at top left, rgba(255,139,61,0.22), transparent 28%), radial-gradient(circle at right center, rgba(182,233,87,0.18), transparent 24%)"
      }
    }
  },
  plugins: []
};
