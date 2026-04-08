import { Outlet, Link } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';
import { User as UserIcon } from 'lucide-react';

export function Layout() {
  const { user, isLoginModalOpen, closeLoginModal, openLoginModal } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-sm relative">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-emerald-900">
            SpaHome
          </Link>
          
          {user ? (
            <Link to="/profile" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-100 group-hover:border-emerald-500 transition-colors bg-gray-100 flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </Link>
          ) : (
            <button
              onClick={openLoginModal}
              className="bg-emerald-900 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-800 transition-colors text-sm"
            >
              Login / Sign Up
            </button>
          )}
        </header>

        <Outlet />
      </main>
      <BottomNav />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}
