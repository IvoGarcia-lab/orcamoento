import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo atual (ex: .env no servidor)
  // Fix: Cast process to any to avoid type error with cwd() if Node types are missing
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Isto permite que 'process.env.API_KEY' funcione no código do cliente
      // Substituindo-o pelo valor real durante o build/dev
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Fallback seguro para evitar erros de 'process is not defined' no browser
      'process.env': {} 
    }
  };
});