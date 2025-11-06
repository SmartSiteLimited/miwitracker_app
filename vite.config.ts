import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv, type ServerOptions } from "vite";
// import vueDevTools from "vite-plugin-vue-devtools";

import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const server: ServerOptions = {}

  if (+env.VITE_DEV_SSL) {
    server['https'] = {
      key: env.VITE_DEV_SSL_KEY,
      cert: env.VITE_DEV_SSL_CERT,
    }
  }

  return {
    base: env.VITE_BASE_URL,
    server,
    define: {
      APP_VERSION: JSON.stringify(env.npm_package_version || '0.0.0'),
    },
    plugins: [
      vue(),
      // vueDevTools(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
