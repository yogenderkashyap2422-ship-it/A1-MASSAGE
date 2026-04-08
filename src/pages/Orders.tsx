import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Clock, CheckCircle2, Package, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface Order {
  id: string;
  serviceType: string;
  dateTime: string;
  status: 'Pending' | 'Accepted' | 'Done';
  price: number;
  address: string;
  createdAt: any;
}

export function Orders() {
  const { user, openLoginModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-full pb-6 bg-gray-50 flex flex-col items-center justify-center p-6 text-center"
      >
        <Package className="w-16 h-16 text-emerald-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Please login to view your orders</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to see your booking history.</p>
        <button
          onClick={openLoginModal}
          className="bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors"
        >
          Login / Sign Up
        </button>
      </motion.div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Accepted': return 'bg-blue-100 text-blue-700';
      case 'Done': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Accepted': return <Package className="w-4 h-4" />;
      case 'Done': return <CheckCircle2 className="w-4 h-4" />;
      default: return null;
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
        <h1 className="text-3xl font-bold text-white">Your Orders</h1>
        <p className="text-emerald-100 mt-2">Track your service bookings</p>
      </div>

      <div className="p-6 space-y-4 -mt-6">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="text-gray-500 text-sm mt-1">Book a service to see it here</p>
          </motion.div>
        ) : (
          orders.map((order, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={order.id} 
              className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{order.serviceType}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.date ? `${order.date} at ${order.slotTime}` : (order.dateTime ? format(new Date(order.dateTime), 'MMM dd, yyyy - h:mm a') : 'No date')}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-600 truncate pr-4">
                  {order.address}
                </div>
                <div className="font-bold text-emerald-900 text-lg">
                  ₹{order.finalPrice || order.price}
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-gray-50">
                <button
                  onClick={() => {
                    if (order.staffLocationLat && order.staffLocationLng) {
                      window.open(`https://www.google.com/maps?q=${order.staffLocationLat},${order.staffLocationLng}`, '_blank');
                    } else if (order.latitude && order.longitude) {
                      window.open(`https://www.google.com/maps?q=${order.latitude},${order.longitude}`, '_blank');
                    } else {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.location || order.address)}`, '_blank');
                    }
                  }}
                  className="w-full bg-blue-50 text-blue-700 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Track Service
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
