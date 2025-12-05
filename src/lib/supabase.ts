import { createClient } from '@supabase/supabase-js';

// Declaração para TypeScript
declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

// --- CREDENCIAIS ---
// 1. URL e Key Hardcoded (Públicas/Anon - Seguras para frontend)
const HARDCODED_URL = "https://evyhiefwkhuyhipdqsfj.supabase.co";
const HARDCODED_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eWhpZWZ3a2h1eWhpcGRxc2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NzA1NjgsImV4cCI6MjA4MDU0NjU2OH0.QrYGKIp2_363GpvzADPYqOSDCoICSTyvKcNHCvek0uI";

let finalUrl = HARDCODED_URL;
let finalKey = HARDCODED_KEY;

// 2. Tentar usar variáveis injetadas pelo Vite (se o deploy as fornecer)
try {
  if (typeof __SUPABASE_URL__ !== 'undefined' && __SUPABASE_URL__) {
    finalUrl = __SUPABASE_URL__;
  }
  if (typeof __SUPABASE_ANON_KEY__ !== 'undefined' && __SUPABASE_ANON_KEY__) {
    finalKey = __SUPABASE_ANON_KEY__;
  }
} catch (e) {
  // Ignorar erros de injeção e manter hardcoded
}

// Inicialização Direta - Sem erros, sem falhas.
export const supabase = createClient(finalUrl, finalKey);