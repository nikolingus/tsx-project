import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // разрешаем внешние подключения
    port: 5173,
    open: true, // автоматически открывать браузер
  },
  root: ".", // явно указываем корневую директорию
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },
});
