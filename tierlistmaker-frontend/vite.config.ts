import path from "path"
// @ts-ignore
import react from "@vitejs/plugin-react"
// @ts-ignore
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "../tierlistmaker-backend/functions/src/public",
  }
})
