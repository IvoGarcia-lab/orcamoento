import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo atual
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Variáveis globais dedicadas para garantir a injeção correta
      // Isto evita conflitos com polyfills de process.env
      '__GEMINI_API_KEY__': JSON.stringify(env.GEMINI_API_KEY || ''),
      
      // Credenciais Supabase com fallback hardcoded para garantir funcionamento
      '__SUPABASE_URL__': JSON.stringify(env.VITE_SUPABASE_URL || 'https://evyhiefwkhuyhipdqsfj.supabase.co'),
      '__SUPABASE_ANON_KEY__': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eWhpZWZ3a2h1eWhpcGRxc2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NzA1NjgsImV4cCI6MjA4MDU0NjU2OH0.QrYGKIp2_363GpvzADPYqOSDCoICSTyvKcNHCvek0uI'),
      
      // Manter compatibilidade com código existente que usa process.env
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env': {}
    }
  };
});