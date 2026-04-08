import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminStaff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Female');
  const [experience, setExperience] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'staff'));
    const unsub = onSnapshot(q, (snapshot) => {
      setStaff(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'staff'));
    return () => unsub();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !experience) return;
    try {
      const id = name.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, 'staff', id), {
        name,
        gender,
        experience,
        photoURL: photoURL || null,
        available: true
      });
      toast.success('Staff added');
      setName('');
      setExperience('');
      setPhotoURL('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'staff');
      toast.error('Failed to add staff');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'staff', id));
      toast.success('Staff deleted');
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

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-900">Add New Staff</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="px-4 py-2 border rounded-xl" required />
          <select value={gender} onChange={e => setGender(e.target.value)} className="px-4 py-2 border rounded-xl">
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
          <input type="text" placeholder="Experience (e.g. 5 Years)" value={experience} onChange={e => setExperience(e.target.value)} className="px-4 py-2 border rounded-xl" required />
          <input type="url" placeholder="Photo URL (Optional)" value={photoURL} onChange={e => setPhotoURL(e.target.value)} className="px-4 py-2 border rounded-xl" />
        </div>
        <button type="submit" className="w-full bg-emerald-900 text-white py-2 rounded-xl font-medium flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </form>

      <div className="space-y-4">
        {staff.map(member => (
          <div key={member.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full overflow-hidden flex items-center justify-center">
                {member.photoURL ? <img src={member.photoURL} alt={member.name} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-emerald-600" />}
              </div>
              <div>
                <div className="font-bold text-gray-900">{member.name}</div>
                <div className="text-sm text-gray-500">{member.gender} | {member.experience}</div>
                <button 
                  onClick={() => toggleAvailability(member.id, member.available)}
                  className={`text-xs font-medium mt-1 ${member.available ? 'text-emerald-600' : 'text-red-500'}`}
                >
                  {member.available ? 'Available' : 'Unavailable'} (Click to toggle)
                </button>
              </div>
            </div>
            <button onClick={() => handleDelete(member.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
