import { defineConfig } from "vite";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: "~", replacement: "/lib" }],
  },
  plugins: [],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "lib/main.ts"),
      name: "ExcelEditor",
      // the proper extensions will be added
      fileName: "excel-editor",
    },
    cssCodeSplit: false,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      // external: ["fabric", "xlsx"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        // globals: {
        //   fabric: "fabric",
        //   xlsx: "XLSX",
        // },
        // css code split false
        assetFileNames: "excel-edit.css",
      },
    },
  },
});
