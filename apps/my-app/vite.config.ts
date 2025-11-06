import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/pages",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // shared 패키지의 alias (my-app에서 shared를 import할 때)
      "@ui": path.resolve(__dirname, "../../packages/shared/src/components/ui"),
      "@lib": path.resolve(__dirname, "../../packages/shared/src/lib"),
      "@hooks": path.resolve(__dirname, "../../packages/shared/src/hooks"),
      "@components": path.resolve(
        __dirname,
        "../../packages/shared/src/components"
      ),
      "@stores": path.resolve(__dirname, "../../packages/shared/src/stores"),
      // my-app 자체의 alias
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
