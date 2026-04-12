import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminSlots() {
  const [slots, setSlots] = useState<any[]>([]);
  const [time, setTime] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'slots'));
    const unsub = onSnapshot(q, (snapshot) => {
      // Sort slots by time roughly (assuming format like "10:00 AM")
      const sorted = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => {
        const timeA = new Date('1970/01/01 ' + a.time);
        const timeB = new Date('1970/01/01 ' + b.time);
        return timeA.getTime() - timeB.getTime();
      });
      setSlots(sorted);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'slots'));
    return () => unsub();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!time) return;
    try {
      const id = time.replace(/\s+/g, '-').toLowerCase();
      await setDoc(doc(db, 'slots', id), {
        time,
        active: true
      });
      toast.success('Slot added');
      setTime('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'slots');
      toast.error('Failed to add slot');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'slots', id));
      toast.success('Slot deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `slots/${id}`);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'slots', id), { active: !current });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `slots/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <input type="text" placeholder="e.g. 10:00 AM" value={time} onChange={e => setTime(e.target.value)} className="flex-1 px-4 py-2 border rounded-xl" required />
        <button type="submit" className="bg-emerald-900 text-white px-6 py-2 rounded-xl font-medium flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {slots.map(slot => (
          <div key={slot.id} className={`p-4 rounded-xl border flex justify-between items-center ${slot.active ? 'bg-white border-emerald-100' : 'bg-gray-50 border-gray-200'}`}>
            <div>
              <div className="font-bold text-gray-900">{slot.time}</div>
              <button 
                onClick={() => toggleActive(slot.id, slot.active)}
                className={`text-xs font-medium ${slot.active ? 'text-emerald-600' : 'text-gray-500'}`}
              >
                {slot.active ? 'Active' : 'Blocked'}
              </button>
            </div>
            <button onClick={() => handleDelete(slot.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
