import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite yapılandırması.
// ÖNEMLİ (istek olayları): Geliştirmede React http://localhost:5173'te,
// Spring Boot http://localhost:8080'de çalışır. Tarayıcı doğrudan 8080'e
// istek atarsa "farklı köken (CORS)" sorunu çıkar. proxy ile /api ile başlayan
// tüm istekleri Vite arka planda 8080'e yönlendirir; böylece kodda yine
// sadece "/api/compare" yazarız, CORS derdi olmaz.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});
