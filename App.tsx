
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './services/supabase';
import { UserRole } from './types/types';

const Home: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("🔄 Test de la connexion Supabase...");
        
        // On teste simplement la récupération de la session. 
        // C'est le moyen le plus sûr de vérifier que le client est bien initialisé 
        // et qu'il peut parler aux serveurs Supabase sans avoir besoin de tables spécifiques.
        const { error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        console.log("✅ Connexion réussie !");
        setStatus('success');
      } catch (err: any) {
        console.error("❌ Erreur de connexion:", err);
        setStatus('error');
        setErrorMessage(err.message || "Impossible de joindre Supabase");
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
            🧹
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Cleaning Platform V2
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Initialisation du système
        </p>

        <div className="space-y-4">
          {/* Test React + Vite */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700 font-medium">React + Vite</span>
            <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold">ACTIF</span>
          </div>

          {/* Test TypeScript Types */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700 font-medium">Types TypeScript</span>
            <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold">
              {UserRole.ADMIN ? 'VALIDE' : 'ERREUR'}
            </span>
          </div>

          {/* Test Supabase */}
          <div className={`flex items-center justify-between p-3 rounded-lg border ${
            status === 'success' ? 'bg-green-50 border-green-200' : 
            status === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <span className={`font-medium ${
              status === 'success' ? 'text-green-800' : 
              status === 'error' ? 'text-red-800' : 'text-blue-800'
            }`}>
              Client Supabase
            </span>
            
            {status === 'loading' && (
              <span className="text-blue-600 text-sm font-medium animate-pulse">Connexion...</span>
            )}
            
            {status === 'success' && (
              <span className="flex items-center text-green-700 text-sm font-bold">
                ✅ CONNECTÉ
              </span>
            )}

            {status === 'error' && (
              <span className="text-red-700 text-sm font-bold">
                ❌ ÉCHEC
              </span>
            )}
          </div>

          {/* Message d'erreur détaillé si besoin */}
          {status === 'error' && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 text-sm rounded-lg border border-red-200">
              <strong>Détail de l'erreur :</strong><br/>
              {errorMessage}
              <div className="mt-2 text-xs opacity-75">
                Vérifiez services/supabase.ts et vos clés API.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
