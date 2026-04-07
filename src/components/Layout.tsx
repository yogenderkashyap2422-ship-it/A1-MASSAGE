import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-sm">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
