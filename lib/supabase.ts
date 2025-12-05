import { createClient } from '@supabase/supabase-js';

// Helper function to safely read environment variables
// Supports both Vite's import.meta.env and standard process.env fallback
const getEnvVar = (key: string): string => {
  // 1. Try Vite (import.meta.env)
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv && metaEnv[key]) {
      return metaEnv[key];
    }
  } catch (e) {
    // Ignore error if import.meta is not available
  }

  // 2. Try Node/Process (process.env) - Fallback for some build environments
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch (e) {
    // Ignore error if process is not available
  }

  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Logger para ajudar no debug em produção (Coolify/Vercel)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "%c⚠️ ERRO CRÍTICO SUPABASE ⚠️", 
    "background: red; color: white; font-size: 14px; padding: 4px;"
  );
  console.error("As variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não foram encontradas.");
  console.info("Certifique-se que adicionou estas variáveis no painel do Coolify/Vercel e fez REDEPLOY.");
}

// Inicialização segura mesmo se as chaves falharem (evita crash imediato da app)
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder-key"
);