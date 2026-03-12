import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { config } from "dotenv";

import path from "path";

config();

const outDir = process.env.VITE_OUT_DIR ?? "../../backend/public/frontend";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir,
    rollupOptions: {
      output: {
        assetFileNames: (assetFileInfo) => `assets/${assetFileInfo.name}`,
        entryFileNames: (entryFileInfo) => `assets/${entryFileInfo.name}.js`,
        chunkFileNames: (chunkFileInfo) => `assets/${chunkFileInfo.name}.js`,
      },
    },
  },
});
