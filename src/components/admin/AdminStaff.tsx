import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Trash2, User, IndianRupee, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminStaff() {
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'staff'));
    const unsub = onSnapshot(q, (snapshot) => {
      setStaff(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'staff'));
    return () => unsub();
  }, []);

  const handleDelete = async (id: string, userId: string) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await deleteDoc(doc(db, 'staff', id));
      if (userId) {
        await updateDoc(doc(db, 'users', userId), { role: 'user' });
      }
      toast.success('Staff removed and converted back to user');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `staff/${id}`);
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'staff', id), { available: !current });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `staff/${id}`);
    }
  };

  const clearPayment = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to clear earnings for ${name}?`)) return;
    try {
      await updateDoc(doc(db, 'staff', id), { totalEarnings: 0 });
      toast.success(`Earnings cleared for ${name}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `staff/${id}`);
      toast.error('Failed to clear payment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mb-6">
        <h3 className="font-bold text-emerald-900 mb-1">Staff Management</h3>
        <p className="text-sm text-emerald-700">To add new staff, go to the "Users" tab and click "Become Staff" next to a user.</p>
      </div>

      <div className="space-y-4">
        {staff.map(member => (
          <div key={member.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                {member.photoURL ? <img src={member.photoURL} alt={member.name} className="w-full h-full object-cover" /> : <User className="w-7 h-7 text-emerald-600" />}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">{member.name}</div>
                <div className="text-sm text-gray-500">{member.phone} • {member.email}</div>
                <div className="text-sm text-gray-500">{member.gender} • {member.experience}</div>
                <button 
                  onClick={() => toggleAvailability(member.id, member.available)}
                  className={`text-xs font-bold mt-2 px-2 py-1 rounded-md ${member.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                >
                  {member.available ? '● Online' : '○ Offline'} (Click to toggle)
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
              <div className="flex gap-4 text-right">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Staff Earnings</p>
                  <p className="font-bold text-emerald-600 text-lg flex items-center justify-end"><IndianRupee className="w-4 h-4" />{member.totalEarnings || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Admin Commission</p>
                  <p className="font-bold text-gray-900 text-lg flex items-center justify-end"><IndianRupee className="w-4 h-4" />{member.totalCommission || 0}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => clearPayment(member.id, member.name)} 
                  className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-bold transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Clear Pay
                </button>
                <button 
                  onClick={() => handleDelete(member.id, member.userId)} 
                  className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-sm font-bold transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        {staff.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No staff members found.
          </div>
        )}
      </div>
    </div>
  );
}
