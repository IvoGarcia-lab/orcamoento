declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;
declare const __GEMINI_API_KEY__: string;

// Manually define Vite types since 'vite/client' is missing in this environment
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly GEMINI_API_KEY: string;
  [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Augment NodeJS namespace to support process.env usage if types are available
declare namespace NodeJS {
  interface ProcessEnv {
    GEMINI_API_KEY?: string;
    [key: string]: string | undefined;
  }
}