import { defineConfig } from "windicss/helpers";

export default defineConfig({
  extract: {
    include: ["src/**/*.{vue,html,jsx,tsx}", "./index.html"],
    exclude: ["node_modules", ".git"],
  },
  theme: {
    extend: {
      colors: {
        primary: "#1677FF",
        danger: "#FF4949",
        link: "#1677FF",
        gray1: "#f7f8fa",
        gray2: "#ebedf0",
        gray6: "#969799",
        gray7: "#646566",
        gray8: "#323233",
      },
    },
  },
});
