import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center border border-gray-200">
        <div className="mb-4">
          <span className="text-4xl">🧹</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Cleaning Platform V2
        </h1>
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium mb-4">
          Environnement configuré avec succès
        </div>
        <div className="text-left space-y-2 text-sm text-gray-600 border-t pt-4">
          <p>✅ Vite + React + TypeScript</p>
          <p>✅ Tailwind CSS (Activé)</p>
          <p>✅ React Router Dom</p>
          <p>✅ Supabase Client (Initialisé)</p>
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