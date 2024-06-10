import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
  base:
    process.env.NODE_ENV === "production"
      ? "/react-shopping-products/dist"
      : "/",
});
