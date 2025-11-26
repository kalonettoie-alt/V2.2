import React from 'react';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginPage from './src/pages/auth/LoginPage';
import { LogOut, User } from 'lucide-react';

function Dashboard() {
  const { user, profile, signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CleanManager</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
              <User size={16} />
            </div>
            <div className="hidden md:block">
              <p className="font-medium">{profile?.full_name || user?.email}</p>
              <p className="text-xs text-gray-500 capitalize">{profile?.role || 'Utilisateur'}</p>
            </div>
          </div>
          <button 
            onClick={signOut}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Se déconnecter"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenue sur votre espace !</h2>
            <p className="text-gray-600 mb-6">Vous êtes connecté avec l'email : <strong>{user?.email}</strong></p>
            
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg inline-block">
              Ceci est un tableau de bord temporaire. <br/>
              Les pages spécifiques ({profile?.role}) seront intégrées prochainement.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-blue-600 animate-pulse font-medium">Chargement de l'application...</div>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}