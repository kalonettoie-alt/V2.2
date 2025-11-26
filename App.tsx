import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginPage from './src/pages/auth/LoginPage';
import { Layout } from './src/components/layout/Layout';
import { UserRole } from './types/types';
import { Loader2, LogOut } from 'lucide-react';

// Composant de test temporaire
function DashboardTest({ title, color }: { title: string; color: string }) {
  const { user } = useAuth();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 className={`text-2xl font-bold mb-2 ${color}`}>{title}</h1>
      <div className="mt-4">
        <p className="text-gray-600">Bienvenue, <span className="font-semibold">{user?.email}</span></p>
        <p className="text-sm text-gray-400 mt-2 italic">
          Le menu de navigation sur le côté (ou en bas sur mobile) vous permet désormais de naviguer.
        </p>
      </div>
    </div>
  );
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

  if (!user) return <Navigate to="/login" replace />;
  
  if (!profile) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 flex-col gap-2">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <span className="text-gray-500 text-sm">Chargement du profil...</span>
    </div>
  );

  if (!allowedRoles.includes(profile.role)) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⛔</div>
          <h2 className="text-xl font-bold text-gray-900">Accès non autorisé</h2>
          <p className="text-gray-500">Votre rôle ({profile.role}) ne permet pas d'accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
     return <div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;
  }

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
            <Layout>
              <DashboardTest title="Dashboard Admin 🛡️" color="text-purple-600" />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/client/*" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
             <Layout>
               <DashboardTest title="Espace Client 🏠" color="text-blue-600" />
             </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/provider/*" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.PRESTATAIRE]}>
            <Layout>
              <DashboardTest title="Espace Prestataire 🧹" color="text-green-600" />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
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