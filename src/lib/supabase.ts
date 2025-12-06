import { createClient } from '@supabase/supabase-js';

// Declaração das variáveis globais injetadas pelo Vite (definidas no vite.config.ts)
declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

// --- CREDENCIAIS DE SEGURANÇA (FALLBACK) ---
// Estas chaves 'anon' são públicas por design e seguras para estar no frontend.
// Permitem que a aplicação funcione imediatamente mesmo se as variáveis de ambiente falharem no servidor.
const FALLBACK_URL = "https://evyhiefwkhuyhipdqsfj.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eWhpZWZ3a2h1eWhpcGRxc2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NzA1NjgsImV4cCI6MjA4MDU0NjU2OH0.QrYGKIp2_363GpvzADPYqOSDCoICSTyvKcNHCvek0uI";

let finalUrl = FALLBACK_URL;
let finalKey = FALLBACK_KEY;

// Tenta usar as variáveis injetadas pelo Vite se estiverem disponíveis e não vazias
try {
  if (typeof __SUPABASE_URL__ !== 'undefined' && __SUPABASE_URL__ !== '') {
    finalUrl = __SUPABASE_URL__;
  }
  if (typeof __SUPABASE_ANON_KEY__ !== 'undefined' && __SUPABASE_ANON_KEY__ !== '') {
    finalKey = __SUPABASE_ANON_KEY__;
  }
} catch (e) {
  // Em caso de erro na leitura, mantém o fallback
  console.warn("Usando credenciais de fallback do Supabase.");
}

// Inicialização do cliente Supabase
export const supabase = createClient(finalUrl, finalKey);