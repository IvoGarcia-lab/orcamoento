import { createClient } from '@supabase/supabase-js';

// Declaração para TypeScript
declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

// Fallback Hardcoded (Garante que a app funciona mesmo sem variáveis de ambiente)
// Estas chaves 'anon' são seguras para estar no frontend (respeitam RLS)
const FALLBACK_URL = "https://evyhiefwkhuyhipdqsfj.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eWhpZWZ3a2h1eWhpcGRxc2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NzA1NjgsImV4cCI6MjA4MDU0NjU2OH0.QrYGKIp2_363GpvzADPYqOSDCoICSTyvKcNHCvek0uI";

// Tentar recuperar valores injetados pelo Vite, se falhar, usar Hardcoded
let supabaseUrl = "";
let supabaseAnonKey = "";

try {
  supabaseUrl = typeof __SUPABASE_URL__ !== 'undefined' ? __SUPABASE_URL__ : "";
} catch (e) {}

try {
  supabaseAnonKey = typeof __SUPABASE_ANON_KEY__ !== 'undefined' ? __SUPABASE_ANON_KEY__ : "";
} catch (e) {}

// Usar fallback se as variáveis estiverem vazias
const finalUrl = supabaseUrl || FALLBACK_URL;
const finalKey = supabaseAnonKey || FALLBACK_KEY;

export const supabase = createClient(finalUrl, finalKey);