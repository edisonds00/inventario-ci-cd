import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  // Configuración de Vitest
  test: {
    environment: "jsdom", // Para simular un navegador
    setupFiles: "./src/setupTests.js", // Donde ponemos los mocks globales
    globals: true, // Permite usar describe/test/expect sin importar
    css: false, // Evita errores al cargar CSS
    mockReset: true, // Limpia mocks entre pruebas
    restoreMocks: true, // Restaura funciones mockeadas
    clearMocks: true, // Limpia el estado entre test
  },
});
