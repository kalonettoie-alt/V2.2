import { createClient } from '@supabase/supabase-js';

// Utilisation de import.meta.env pour Vite
// Les types sont maintenant gérés par vite-env.d.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);