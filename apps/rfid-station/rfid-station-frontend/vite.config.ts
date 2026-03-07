import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";

config();

const outDir = process.env.OUT_DIR ?? "../../backend/public/panel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4444",
        changeOrigin: true,
      },
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
