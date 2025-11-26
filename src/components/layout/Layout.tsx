import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../../types/types';
import { 
  LayoutDashboard, 
  Home, 
  Calendar, 
  LogOut, 
  Briefcase, 
  CheckSquare,
  Users,
  HardHat
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// ========================================
// SIDEBAR (DESKTOP)
// ========================================

const Sidebar = ({ user, signOut }: { user: any, signOut: () => void }) => {
  const location = useLocation();

  const getNavItems = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return [
          { icon: Calendar, label: 'Calendrier', path: '/admin/calendar' },
          { icon: Briefcase, label: 'Interventions', path: '/admin/interventions' },
          { icon: LayoutDashboard, label: 'Tableau de bord', path: '/admin' },
          { icon: Users, label: 'Clients', path: '/admin/clients' },
          { icon: HardHat, label: 'Prestataires', path: '/admin/prestataires' },
          { icon: Home, label: 'Logements', path: '/admin/logements' },
        ];
      case UserRole.PRESTATAIRE:
        // Note: '/provider' est utilisé dans App.tsx, on adapte les chemins
        return [
          { icon: LayoutDashboard, label: 'Accueil', path: '/provider' },
          { icon: CheckSquare, label: 'Mes Missions', path: '/provider/missions' },
          { icon: Calendar, label: 'Planning', path: '/provider/planning' },
        ];
      case UserRole.CLIENT:
        return [
          { icon: LayoutDashboard, label: 'Mon Espace', path: '/client' },
          { icon: Home, label: 'Mes Biens', path: '/client/logements' },
          { icon: Calendar, label: 'Réservations', path: '/client/reservations' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          CleanManager
        </h1>
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
           Espace {user.role}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
            {user.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.full_name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

// ========================================
// BOTTOM NAV (MOBILE)
// ========================================

const BottomNav = ({ user }: { user: any }) => {
  const location = useLocation();
  
  const getNavItems = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return [
          { icon: Calendar, label: 'Cal.', path: '/admin/calendar' },
          { icon: Briefcase, label: 'Inter.', path: '/admin/interventions' },
          { icon: LayoutDashboard, label: 'Dash', path: '/admin' },
          { icon: Users, label: 'Clients', path: '/admin/clients' },
          { icon: HardHat, label: 'Prest.', path: '/admin/prestataires' },
        ];
      case UserRole.PRESTATAIRE:
        return [
          { icon: LayoutDashboard, label: 'Accueil', path: '/provider' },
          { icon: CheckSquare, label: 'Missions', path: '/provider/missions' },
          { icon: Calendar, label: 'Agenda', path: '/provider/planning' },
        ];
      case UserRole.CLIENT:
        return [
          { icon: LayoutDashboard, label: 'Accueil', path: '/client' },
          { icon: Home, label: 'Biens', path: '/client/logements' },
          { icon: Calendar, label: 'Suivi', path: '/client/reservations' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// ========================================
// MAIN LAYOUT
// ========================================

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  
  // Protection : Si pas d'user ou pas encore de profil chargé, on rend les enfants 
  // (la protection est déjà gérée par ProtectedRoute, ici c'est juste de l'affichage)
  if (!user || !profile) return <>{children}</>;

  // On combine les infos pour l'affichage
  const displayUser = {
    ...user,
    full_name: profile.full_name,
    role: profile.role
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={displayUser} signOut={signOut} />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-20 flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-gray-900">CleanManager</h1>
        <button onClick={() => signOut()} className="text-gray-500">
          <LogOut size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 transition-all duration-200">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <BottomNav user={displayUser} />
    </div>
  );
};