import { createClient } from '@supabase/supabase-js';

// Récupération sécurisée des variables d'environnement
// Fallback sur les chaînes directes si l'environnement Vite n'est pas encore chargé (évite le redémarrage serveur immédiat)
const getEnvVar = (key: string, fallback: string) => {
  try {
    // @ts-ignore
    return import.meta.env[key] || fallback;
  } catch (e) {
    return fallback;
  }
};

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL', 'https://vxzdatmgmckdrellazvd.supabase.co');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4emRhdG1nbWNrZHJlbGxhenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNDE2MjIsImV4cCI6MjA3OTYxNzYyMn0.suxXY4hMdY0_am3SjM6t-w0FPF1tI4dvUpLQt1QMPug');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Cette erreur ne devrait plus se produire grâce aux fallbacks
  console.error('❌ Erreur critique : Clés Supabase introuvables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'sb-auth-token',
  },
  global: {
    headers: {
      'X-Client-Info': 'cleaning-platform-v2'
    }
  }
});

export type SupabaseClient = typeof supabase;