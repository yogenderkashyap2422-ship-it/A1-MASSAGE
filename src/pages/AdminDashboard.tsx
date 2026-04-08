import { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Users, Package, Clock, CheckCircle2, MapPin, Copy, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { AdminCoupons } from '../components/admin/AdminCoupons';
import { AdminStaff } from '../components/admin/AdminStaff';
import { AdminSlots } from '../components/admin/AdminSlots';

export function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'orders' | 'users' | 'staff' | 'coupons' | 'slots'>('reports');

  useEffect(() => {
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));

    const qUsers = query(collection(db, 'users'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

    return () => {
      unsubOrders();
      unsubUsers();
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      toast.error('Failed to update status');
    }
  };

  const updateOrderLocation = async (orderId: string) => {
    const lat = prompt("Enter new Latitude:");
    const lng = prompt("Enter new Longitude:");
    if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      try {
        await updateDoc(doc(db, 'orders', orderId), { 
          staffLocationLat: Number(lat),
          staffLocationLng: Number(lng)
        });
        toast.success('Location updated');
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      }
    }
  };

  const sendWhatsApp = (phone: string, orderId: string, status: string) => {
    const message = `Hello! Your SpaHome order (${orderId}) status is now: ${status}.`;
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const reports = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    completed: orders.filter(o => o.status === 'Done').length,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-full pb-6 bg-gray-50"
    >
      <div className="bg-emerald-900 text-white px-6 py-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-emerald-100 mt-1">Manage your premium services</p>
      </div>

      <div className="flex overflow-x-auto border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm no-scrollbar">
        {(['reports', 'orders', 'users', 'staff', 'coupons', 'slots'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-none px-6 py-4 text-sm font-bold capitalize transition-colors ${
              activeTab === tab 
                ? 'text-emerald-900 border-b-2 border-emerald-900' 
                : 'text-gray-500 hover:text-emerald-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === 'reports' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                  <Package className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{reports.total}</p>
                <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{reports.pending}</p>
                <p className="text-sm text-gray-500 font-medium">Pending</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 col-span-2 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{reports.completed}</p>
                  <p className="text-sm text-gray-500 font-medium mt-1">Completed Orders</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {orders.map(order => (
              <div key={order.id} className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{order.serviceType}</h3>
                    <p className="text-sm text-gray-500">{order.name} • {order.phone}</p>
                    <p className="text-sm font-bold text-emerald-900 mt-1">₹{order.finalPrice || order.price}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="mb-1"><strong>Time:</strong> {order.date ? `${order.date} at ${order.slotTime}` : (order.dateTime ? format(new Date(order.dateTime), 'PP p') : 'N/A')}</p>
                  {order.staffName && <p className="mb-1"><strong>Staff:</strong> {order.staffName}</p>}
                  {order.couponCode && <p className="mb-1 text-emerald-600"><strong>Coupon:</strong> {order.couponCode} (-₹{order.discount})</p>}
                  <p className="mb-1"><strong>Address:</strong> {order.address}</p>
                  <p className="truncate"><strong>Location:</strong> {order.location}</p>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => {
                      if (order.latitude && order.longitude) {
                        window.open(`https://www.google.com/maps?q=${order.latitude},${order.longitude}`, '_blank');
                      } else {
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.location || order.address)}`, '_blank');
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    View Location
                  </button>
                  <button
                    onClick={() => updateOrderLocation(order.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-700 py-2 rounded-xl text-sm font-bold hover:bg-purple-100 transition-colors"
                  >
                    Update Loc
                  </button>
                  <button
                    onClick={() => sendWhatsApp(order.phone, order.id, order.status)}
                    className="flex items-center justify-center p-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors border border-green-200"
                    title="Send WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${order.address}, ${order.location}`);
                      toast.success('Address copied!');
                    }}
                    className="flex items-center justify-center p-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                    title="Copy Address"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  {order.status === 'Pending' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Accepted')}
                      className="flex-1 bg-emerald-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-colors shadow-sm"
                    >
                      Accept Order
                    </button>
                  )}
                  {order.status === 'Accepted' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Done')}
                      className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-500 transition-colors shadow-sm"
                    >
                      Mark as Done
                    </button>
                  )}
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-center text-gray-500 py-10">No orders found.</p>}
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {users.map(u => (
              <div key={u.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                    {u.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'staff' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AdminStaff />
          </motion.div>
        )}

        {activeTab === 'coupons' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AdminCoupons />
          </motion.div>
        )}

        {activeTab === 'slots' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AdminSlots />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}