import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, FileText, Home, Settings, Workflow } from 'lucide-react';

import { useAuthStore } from '@store/authStore';

const navItems = [
  { to: '/', label: 'Dashboard', icon: <Home size={18} /> },
  { to: '/documents', label: 'Documents', icon: <FileText size={18} /> },
  { to: '/workflows', label: 'Workflows', icon: <Workflow size={18} /> },
  { to: '/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
];

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <h1 className="text-xl font-semibold">Ethiopia DMS</h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium">{user?.fullName ?? 'Guest User'}</span>
            <span className="text-xs text-slate-500">{user?.department ?? 'No department'}</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
            {user?.initials ?? 'GU'}
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="w-64 bg-white px-4 py-6 shadow-lg">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

