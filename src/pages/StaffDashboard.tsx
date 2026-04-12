import { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';
import { MapPin, Clock, CheckCircle2, IndianRupee, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

export default function StaffDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [staffData, setStaffData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch staff data
    const qStaff = query(collection(db, 'staff'), where('userId', '==', auth.currentUser.uid));
    const unsubStaff = onSnapshot(qStaff, (snapshot) => {
      if (!snapshot.empty) {
        setStaffData({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'staff'));

    // Fetch assigned orders
    const qOrders = query(
      collection(db, 'orders'), 
      where('staffId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));

    return () => {
      unsubStaff();
      unsubOrders();
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      const now = new Date().toISOString();
      
      if (newStatus === 'Accepted') {
        updateData.acceptedAt = now;
      } else if (newStatus === 'On the way') {
        updateData.onTheWayAt = now;
      } else if (newStatus === 'In Progress') {
        updateData.serviceStartTime = now;
        updateData.inProgressAt = now;
      } else if (newStatus === 'Done') {
        updateData.serviceEndTime = now;
        updateData.doneAt = now;
        updateData.trackingEnabled = false;
        
        // Calculate earnings
        const order = orders.find(o => o.id === orderId);
        if (order && staffData) {
          const finalPrice = order.finalPrice || order.price;
          const adminCommission = 250;
          const staffEarnings = Math.max(0, finalPrice - adminCommission);
          
          updateData.adminCommission = adminCommission;
          updateData.staffEarnings = staffEarnings;

          // Update staff total earnings
          await updateDoc(doc(db, 'staff', staffData.id), {
            totalEarnings: (staffData.totalEarnings || 0) + staffEarnings,
            totalCommission: (staffData.totalCommission || 0) + adminCommission
          });
        }
      } else if (newStatus === 'Pending') { // Rejected
        updateData.staffId = null;
        updateData.staffName = null;
      }

      await updateDoc(doc(db, 'orders', orderId), updateData);
      toast.success(newStatus === 'Pending' ? 'Order Rejected' : `Status updated to ${newStatus}`);

      // Notify customer
      const order = orders.find(o => o.id === orderId);
      if (order && order.phone && newStatus !== 'Pending') {
        const message = `Hello! Your SpaHome order (${orderId}) status is now: ${newStatus}.`;
        const url = `https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      toast.error('Failed to update status');
    }
  };

  const updateLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    toast.loading('Getting location...', { id: 'location' });
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const activeOrders = orders.filter(o => ['Accepted', 'On the way', 'In Progress'].includes(o.status));
          
          for (const order of activeOrders) {
            await updateDoc(doc(db, 'orders', order.id), {
              staffLocationLat: position.coords.latitude,
              staffLocationLng: position.coords.longitude
            });
          }
          
          toast.success('Location updated for active orders', { id: 'location' });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, 'orders');
          toast.error('Failed to update location', { id: 'location' });
        }
      },
      (error) => {
        toast.error('Failed to get location. Please enable location services.', { id: 'location' });
      }
    );
  };

  const toggleAvailability = async () => {
    if (!staffData) return;
    try {
      await updateDoc(doc(db, 'staff', staffData.id), { available: !staffData.available });
      toast.success(staffData.available ? 'You are now offline' : 'You are now online');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `staff/${staffData.id}`);
      toast.error('Failed to update availability');
    }
  };

  const activeOrders = orders.filter(o => ['Assigned', 'Accepted', 'On the way', 'In Progress'].includes(o.status) && !o.deleted);
  const completedOrders = orders.filter(o => o.status === 'Done' && !o.deleted);

  if (!staffData) {
    return <div className="min-h-screen flex items-center justify-center">Loading staff data...</div>;
  }

  return (
    <div className="min-h-full pb-20 bg-gray-50">
      <div className="bg-emerald-900 text-white px-6 py-8 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Staff Dashboard</h1>
            <p className="text-emerald-100 mt-1">Welcome back, {staffData.name}</p>
          </div>
          <button 
            onClick={toggleAvailability}
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${staffData.available ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
          >
            {staffData.available ? '● Online' : '○ Offline'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
            <p className="text-emerald-100 text-sm mb-1">My Earnings</p>
            <p className="text-2xl font-bold flex items-center"><IndianRupee className="w-5 h-5" />{staffData.totalEarnings || 0}</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
            <p className="text-emerald-100 text-sm mb-1">Completed</p>
            <p className="text-2xl font-bold">{completedOrders.length}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="flex bg-white rounded-xl p-1 shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'active' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500'}`}
          >
            Active ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'history' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500'}`}
          >
            History
          </button>
        </div>

        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeOrders.length > 0 && (
              <button 
                onClick={updateLocation}
                className="w-full bg-blue-50 text-blue-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-4"
              >
                <Navigation className="w-5 h-5" /> Update My Location
              </button>
            )}

            {activeOrders.map(order => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{order.serviceType}</h3>
                    <p className="text-sm text-gray-500">{order.name} • {order.phone}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    order.status === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Accepted' ? 'bg-indigo-100 text-indigo-700' :
                    order.status === 'On the way' ? 'bg-purple-100 text-purple-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl">
                  <p className="mb-1"><Clock className="w-3 h-3 inline mr-1" /> {order.date ? `${order.date} at ${order.slotTime}` : (order.dateTime ? format(new Date(order.dateTime), 'PP p') : 'N/A')}</p>
                  <p className="mb-1"><MapPin className="w-3 h-3 inline mr-1" /> {order.address}</p>
                  <p className="font-bold text-emerald-900 mt-2">Price: ₹{order.finalPrice || order.price}</p>
                </div>

                {order.status === 'Assigned' ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Pending')}
                      className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-700 font-bold bg-red-50"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Accepted')}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold"
                    >
                      Accept
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 outline-none font-bold text-gray-700 bg-white"
                    >
                      <option value="Accepted">Accepted</option>
                      <option value="On the way">On the way</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Mark as Done</option>
                    </select>
                    <button
                      onClick={() => {
                        if (order.latitude && order.longitude) {
                          window.open(`https://www.google.com/maps?q=${order.latitude},${order.longitude}`, '_blank');
                        } else {
                          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.location || order.address)}`, '_blank');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" /> Navigate to Customer
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
            {activeOrders.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No active orders assigned to you.
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {completedOrders.map(order => (
              <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{order.serviceType}</h3>
                    <p className="text-sm text-gray-500">{order.date ? order.date : (order.dateTime ? format(new Date(order.dateTime), 'PP') : '')}</p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Done
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                  <span className="text-sm text-gray-500">Your Earnings</span>
                  <span className="font-bold text-emerald-900">₹{order.staffEarnings || 0}</span>
                </div>
              </div>
            ))}
            {completedOrders.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No completed orders yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
