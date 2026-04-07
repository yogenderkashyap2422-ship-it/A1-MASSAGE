import { useAuth } from '../contexts/AuthContext';
import { LogOut, Info, Mail, Shield, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Profile() {
  const { user, logout } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-full pb-6 bg-gray-50"
    >
      <div className="bg-emerald-900 px-6 py-8 rounded-b-[2rem] shadow-lg">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
      </div>

      <div className="p-6 -mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-6 flex items-center gap-4"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-900">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <div className="mt-1 inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded uppercase tracking-wider">
              {user?.role}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-6"
        >
          <button className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 transition-colors border-b border-gray-50 group">
            <div className="flex items-center gap-3 text-gray-700 group-hover:text-emerald-900">
              <Info className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
              <span className="font-medium">About Us</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 transition-colors border-b border-gray-50 group">
            <div className="flex items-center gap-3 text-gray-700 group-hover:text-emerald-900">
              <Mail className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
              <span className="font-medium">Contact</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 transition-colors group">
            <div className="flex items-center gap-3 text-gray-700 group-hover:text-emerald-900">
              <Shield className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
              <span className="font-medium">Privacy Policy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600" />
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={logout}
          className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </motion.button>
      </div>
    </motion.div>
  );
}
