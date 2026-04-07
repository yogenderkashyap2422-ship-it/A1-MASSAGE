import { NavLink } from 'react-router-dom';
import { Home, Briefcase, ClipboardList, User, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export function BottomNav() {
  const { user } = useAuth();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/services', icon: Briefcase, label: 'Service' },
    { to: '/orders', icon: ClipboardList, label: 'Order' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/admin', icon: Shield, label: 'Admin' });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-40">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-all duration-300',
                isActive ? 'text-emerald-700 scale-110' : 'text-gray-400 hover:text-emerald-600'
              )
            }
          >
            <Icon className="w-6 h-6" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
