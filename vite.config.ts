import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo atual
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Injeção de variáveis globais
      '__GEMINI_API_KEY__': JSON.stringify(env.GEMINI_API_KEY || ''),
      
      // Credenciais Supabase - Prioridade: ENV > Fallback String Vazia (o fallback real está no supabase.ts)
      '__SUPABASE_URL__': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      '__SUPABASE_ANON_KEY__': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      
      // Manter compatibilidade
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env': {}
    }
  };
});