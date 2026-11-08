import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // caminhos relativos: a build funciona em qualquer pasta
  // host: true deixa o servidor acessível pela porta encaminhada do Codespaces
  server: { host: true, port: 5173 },
});
