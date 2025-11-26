import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginPage from './src/pages/auth/LoginPage';
import { UserRole } from './types/types';
import { Loader2 } from 'lucide-react';

// --- Composants Temporaires pour les Dashboards ---
const AdminDashboard = () => <div className="p-8 text-2xl font-bold text-purple-600">Espace Administrateur 🛡️</div>;
const ClientDashboard = () => <div className="p-8 text-2xl font-bold text-blue-600">Espace Client 🏠</div>;
const ProviderDashboard = () => <div className="p-8 text-2xl font-bold text-green-600">Espace Prestataire 🧹</div>;
const Unauthorized = () => <div className="p-8 text-red-600 font-bold">Accès non autorisé ⛔</div>;

// --- Composant de Protection des Routes ---
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  // 1. Non connecté -> Redirection vers Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Connecté mais profil pas encore chargé (ou erreur RLS) -> Attente
  if (!profile) {
    return (
       <div className="flex flex-col items-center justify-center h-screen bg-gray-50 gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Chargement du profil...</p>
        <p className="text-xs text-gray-400">Vérification des droits d'accès</p>
      </div>
    );
  }

  // 3. Rôle non autorisé -> Page Unauthorized
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

// --- Composant de Redirection Racine ---
const RootRedirect = () => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Redirection intelligente selon le rôle
  if (profile?.role === UserRole.ADMIN) return <Navigate to="/admin" replace />;
  if (profile?.role === UserRole.CLIENT) return <Navigate to="/client" replace />;
  if (profile?.role === UserRole.PRESTATAIRE) return <Navigate to="/provider" replace />;
  
  return <div className="p-8 text-center text-gray-500">Profil incomplet ou rôle inconnu.</div>;
};

// --- Application Principale ---
export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Route Publique */}
          <Route path="/login" element={<LoginPage />} />

          {/* Redirection Racine */}
          <Route path="/" element={<RootRedirect />} />

          {/* Routes Protégées ADMIN */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Routes Protégées CLIENT */}
          <Route 
            path="/client/*" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Routes Protégées PRESTATAIRE */}
          <Route 
            path="/provider/*" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.PRESTATAIRE]}>
                <ProviderDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}