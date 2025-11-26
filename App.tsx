import React from 'react';
import { AuthProvider, useAuth } from './src/context/AuthContext';

function TestAuth() {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-blue-600 animate-pulse font-medium">Chargement de la session...</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center">
        <h1 className="text-xl font-bold mb-4">Test Authentification</h1>
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
          user ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
        }`}>
          {user ? '✅ Connecté' : '👤 Non connecté'}
        </div>
        
        {user && (
          <div className="mt-4 text-left bg-gray-50 p-3 rounded text-sm text-gray-600 overflow-hidden">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id.slice(0, 8)}...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TestAuth />
    </AuthProvider>
  );
}