/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode:"class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        textcolor:"#1c1d1d",
        primary:{
          100:"#7ea1bd",
          200:"#6991b2",
          300:"#5381a7",
          400:"#3e729c",
          500:"#286291",
          600:"#1c4566",
          700:"#183b57",
          800:"#10273a",
          900:"#08141d",
        },
        secondary:{

        },
      
      },
      fontFamily:{
        Nunito:["Nunito"],
        "Nunito-Bold":["Nunito-Bold"],
        "Nunito-SemiBold":["Nunito-SemiBold"],
        "Nunito-ExtraBold":["Nunito-ExtraBold"],
        Poppins:["Poppins"],
        "Poppins-SemiBold":["Poppins-SemiBold"],
        "Poppins-Bold":["Poppins-Bold"],
        "Poppins-ExtraBold":["Poppins-ExtraBold"],

      },
    },
  },
  plugins: [],
};
