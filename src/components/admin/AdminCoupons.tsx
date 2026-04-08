import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'coupons'));
    const unsub = onSnapshot(q, (snapshot) => {
      setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'coupons'));
    return () => unsub();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discount || !expiryDate) return;
    try {
      await setDoc(doc(db, 'coupons', code.toUpperCase()), {
        code: code.toUpperCase(),
        discount: Number(discount),
        expiryDate,
        usageCount: 0,
        active: true
      });
      toast.success('Coupon added');
      setCode('');
      setDiscount('');
      setExpiryDate('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'coupons');
      toast.error('Failed to add coupon');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', id));
      toast.success('Coupon deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `coupons/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-900">Add New Coupon</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Code (e.g. FIRST50)" value={code} onChange={e => setCode(e.target.value)} className="px-4 py-2 border rounded-xl" required />
          <input type="number" placeholder="Discount (₹)" value={discount} onChange={e => setDiscount(e.target.value)} className="px-4 py-2 border rounded-xl" required />
          <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="px-4 py-2 border rounded-xl col-span-2" required />
        </div>
        <button type="submit" className="w-full bg-emerald-900 text-white py-2 rounded-xl font-medium flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </form>

      <div className="space-y-4">
        {coupons.map(coupon => (
          <div key={coupon.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <div className="font-bold text-emerald-900">{coupon.code}</div>
              <div className="text-sm text-gray-500">₹{coupon.discount} OFF | Expires: {coupon.expiryDate}</div>
              <div className="text-xs text-gray-400">Used: {coupon.usageCount} times</div>
            </div>
            <button onClick={() => handleDelete(coupon.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
