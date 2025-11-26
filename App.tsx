import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginPage from './src/pages/auth/LoginPage';
import { UserRole } from './types/types';
import { Loader2 } from 'lucide-react';

// Page temporaire admin
function AdminTemp() {
  return <div className="p-8 text-2xl font-bold text-purple-600">Dashboard Admin (à venir) 🛡️</div>;
}

// Protection des routes
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Si pas connecté, retour au login
  if (!user) return <Navigate to="/login" replace />;
  
  // Si connecté mais pas de profil chargé (bug RLS ou latence), on attend un peu
  if (!profile) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 flex-col gap-2">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <span className="text-gray-500 text-sm">Chargement du profil...</span>
    </div>
  );

  // Si le rôle n'est pas autorisé
  if (!allowedRoles.includes(profile.role)) {
    return <div className="p-8 text-red-600 font-bold">Accès non autorisé ⛔</div>;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
     return <div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;
  }

  // Si pas connecté, on montre le login (sauf si l'URL est explicite, géré par le Router)
  // Ici, on définit les routes globales
  
  const getRedirectPath = () => {
    if (!profile) return '/login';
    if (profile.role === UserRole.ADMIN) return '/admin';
    if (profile.role === UserRole.CLIENT) return '/client';
    return '/provider';
  };

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={getRedirectPath()} replace />} />
      
      <Route path="/" element={<Navigate to={user ? getRedirectPath() : "/login"} replace />} />
      
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminTemp />
          </ProtectedRoute>
        }
      />
      
      {/* Routes client et prestataire à ajouter plus tard, redirection temporaire pour test */}
      <Route path="/client" element={<div className="p-8 text-blue-600">Espace Client (Bientôt) 🏠</div>} />
      <Route path="/provider" element={<div className="p-8 text-green-600">Espace Prestataire (Bientôt) 🧹</div>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}