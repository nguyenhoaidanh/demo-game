import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 7456 },
  plugins: [
    react(),
    nodePolyfills({
      include: ["crypto", "stream"],
    }),
  ],
  resolve: {
    alias: {
      // Polyfills for crypto and stream
      crypto: "crypto-browserify",
      stream: "stream-browserify",
    },
  },
  build: {
    outDir: "build", // Change 'build' to your preferred folder name
  },
});
