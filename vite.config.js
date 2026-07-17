import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const vitePort = Number(process.env.VITE_PORT) || 5195;
const hmrHost = process.env.VITE_HMR_HOST;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    host: "0.0.0.0",
    // Prod nginx (lassenrents.unwhelm.online) proxies to 5195
    port: vitePort,
    strictPort: true,
    allowedHosts: ["lassenrents.unwhelm.online", ".unwhelm.online", "localhost"],
    ...(hmrHost
      ? {
          hmr: {
            protocol: "wss",
            host: hmrHost,
            clientPort: 443
          }
        }
      : {}),
    proxy: {
      "/api": "http://localhost:5175",
      "/help": "http://localhost:5175"
    }
  }
});
