// Définitions de types globaux pour l'application
export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'cleaner' | 'client';
}