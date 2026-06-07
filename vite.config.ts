import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Backend que serve a documentação, páginas legais (/termos, /privacidade) e
// os assets em /static/docs. A doc tem fonte única no backend — não duplicamos
// aqui. Troque para "http://localhost:8000" se quiser pré-visualizar edições
// locais da documentação rodando o backend junto.
const BACKEND = "https://tibia-toolkit-production.up.railway.app";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/documentacao": { target: BACKEND, changeOrigin: true },
      "/termos": { target: BACKEND, changeOrigin: true },
      "/privacidade": { target: BACKEND, changeOrigin: true },
      "/static": { target: BACKEND, changeOrigin: true },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
