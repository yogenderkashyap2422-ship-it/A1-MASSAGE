import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Info, Mail, Shield, ChevronRight, User as UserIcon, Edit2, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

export function Profile() {
  const { user, logout, openLoginModal } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [newPhotoUrl, setNewPhotoUrl] = useState(user?.photoURL || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setSaving(true);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: newName,
        photoURL: newPhotoUrl || null
      });
      toast.success('Profile updated!');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

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
        {user ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-6"
          >
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 bg-emerald-900 text-white py-2 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-900 overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                    <div className="mt-1 inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded uppercase tracking-wider">
                      {user.role}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-emerald-600 transition-colors bg-gray-50 rounded-full"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 mb-6 text-center"
          >
            <UserIcon className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SpaHome</h2>
            <p className="text-gray-600 mb-6">Login to manage your bookings and profile.</p>
            <button
              onClick={openLoginModal}
              className="bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors w-full"
            >
              Login / Sign Up
            </button>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-6"
        >
          <Link to="/about" className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 transition-colors border-b border-gray-50 group">
            <div className="flex items-center gap-3 text-gray-700 group-hover:text-emerald-900">
              <Info className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
              <span className="font-medium">About Us</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600" />
          </Link>
          <Link to="/contact" className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 transition-colors border-b border-gray-50 group">
            <div className="flex items-center gap-3 text-gray-700 group-hover:text-emerald-900">
              <Mail className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
              <span className="font-medium">Contact</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600" />
          </Link>
          <Link to="/privacy-policy" className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 transition-colors group">
            <div className="flex items-center gap-3 text-gray-700 group-hover:text-emerald-900">
              <Shield className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
              <span className="font-medium">Privacy Policy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600" />
          </Link>
        </motion.div>

        {user && (
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
        )}
      </div>
    </motion.div>
  );
}
