import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Clock, CheckCircle2, Package, MapPin, FileText, RefreshCw, Star, X, Download } from 'lucide-react';
import { format, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  serviceType: string;
  dateTime?: string;
  date?: string;
  slotTime?: string;
  status: 'Pending' | 'Accepted' | 'On the way' | 'In Progress' | 'Done' | 'Cancelled';
  price: number;
  finalPrice?: number;
  address: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  staffLocationLat?: number;
  staffLocationLng?: number;
  trackingEnabled?: boolean;
  serviceStartTime?: string;
  serviceEndTime?: string;
  acceptedAt?: string;
  onTheWayAt?: string;
  inProgressAt?: string;
  doneAt?: string;
  cancelledAt?: string;
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

  const navigate = useNavigate();
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'On the way': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'In Progress': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Done': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Accepted': return <Package className="w-4 h-4" />;
      case 'On the way': return <MapPin className="w-4 h-4" />;
      case 'In Progress': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'Done': return <CheckCircle2 className="w-4 h-4" />;
      case 'Cancelled': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Accepted': return 25;
      case 'On the way': return 50;
      case 'In Progress': return 75;
      case 'Done': return 100;
      case 'Cancelled': return 0;
      default: return 0;
    }
  };

  const Timer = ({ startTime }: { startTime: string }) => {
    const [duration, setDuration] = useState('');

    useEffect(() => {
      const updateTimer = () => {
        const start = new Date(startTime);
        const now = new Date();
        const diffInSeconds = differenceInSeconds(now, start);
        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;
        setDuration(`${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }, [startTime]);

    return <span className="font-mono font-bold text-purple-700">{duration}</span>;
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
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              {/* Progress Bar */}
              {order.status !== 'Cancelled' ? (
                <div className="mb-6 mt-2">
                  <div className="relative flex justify-between">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
                    <motion.div 
                      className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full z-0"
                      initial={{ width: 0 }}
                      animate={{ width: `${getStatusProgress(order.status)}%` }}
                    />
                    
                    {[
                      { label: 'Pending', status: 'Pending', time: order.createdAt?.toDate ? format(order.createdAt.toDate(), 'h:mm a') : '' },
                      { label: 'Accepted', status: 'Accepted', time: order.acceptedAt ? format(new Date(order.acceptedAt), 'h:mm a') : '' },
                      { label: 'On way', status: 'On the way', time: order.onTheWayAt ? format(new Date(order.onTheWayAt), 'h:mm a') : '' },
                      { label: 'Started', status: 'In Progress', time: order.inProgressAt ? format(new Date(order.inProgressAt), 'h:mm a') : '' },
                      { label: 'Done', status: 'Done', time: order.doneAt ? format(new Date(order.doneAt), 'h:mm a') : '' }
                    ].map((step, i) => {
                      const isActive = getStatusProgress(order.status) >= (i * 25);
                      const isCurrent = order.status === step.status || (order.status === 'Pending' && step.status === 'Pending');
                      
                      return (
                        <div key={step.label} className="relative z-10 flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-2 ${isActive ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-200'} ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`} />
                          <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-emerald-700' : 'text-gray-400'}`}>{step.label}</span>
                          {step.time && <span className="text-[9px] text-gray-400">{step.time}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center justify-center text-red-700">
                  <span className="text-sm font-bold">Order Cancelled</span>
                  {order.cancelledAt && <span className="text-xs mt-1">at {format(new Date(order.cancelledAt), 'h:mm a')}</span>}
                </div>
              )}

              {/* Service Timer */}
              {order.status === 'In Progress' && order.serviceStartTime && (
                <div className="mb-4 p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-900">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Service in progress</span>
                  </div>
                  <Timer startTime={order.serviceStartTime} />
                </div>
              )}

              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-600 truncate pr-4">
                  {order.address}
                </div>
                <div className="font-bold text-emerald-900 text-lg">
                  ₹{order.finalPrice || order.price}
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-gray-50 flex flex-col gap-2">
                {['Accepted', 'On the way', 'In Progress'].includes(order.status) && order.trackingEnabled !== false && (
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
                    className="w-full bg-blue-50 text-blue-700 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Track Service
                  </button>
                )}

                {['Accepted', 'On the way', 'In Progress'].includes(order.status) && order.trackingEnabled === false && (
                  <div className="text-center text-xs text-gray-500 py-2 bg-gray-50 rounded-xl">
                    Tracking available only during active service
                  </div>
                )}

                {order.status === 'Done' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedInvoice(order)}
                      className="flex-1 bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 border border-gray-200"
                    >
                      <FileText className="w-4 h-4" />
                      Invoice
                    </button>
                    <button
                      onClick={() => navigate('/services')}
                      className="flex-1 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 border border-emerald-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Book Again
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Smart Recommendations */}
      {orders.length > 0 && (
        <div className="px-6 pb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Customers also booked
          </h3>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-900">Premium Spa Package</h4>
              <p className="text-sm text-gray-500">Relaxing 90-min session</p>
            </div>
            <button
              onClick={() => navigate('/services')}
              className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-sm hover:bg-emerald-100 transition-colors"
            >
              View
            </button>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 bg-emerald-900 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">Digital Invoice</h2>
                <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-emerald-800 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-xl text-gray-900">SpaHome Services</h3>
                  <p className="text-sm text-gray-500">Order #{selectedInvoice.id.slice(0, 8).toUpperCase()}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-900">
                      {selectedInvoice.date ? `${selectedInvoice.date}` : (selectedInvoice.dateTime ? format(new Date(selectedInvoice.dateTime), 'MMM dd, yyyy') : 'N/A')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service</span>
                    <span className="font-medium text-gray-900">{selectedInvoice.serviceType}</span>
                  </div>
                  {selectedInvoice.staffName && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Professional</span>
                      <span className="font-medium text-gray-900">{selectedInvoice.staffName}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{selectedInvoice.price}</span>
                  </div>
                  {selectedInvoice.discount && selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({selectedInvoice.couponCode})</span>
                      <span>-₹{selectedInvoice.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                    <span className="text-gray-900">Total</span>
                    <span className="text-emerald-900">₹{selectedInvoice.finalPrice || selectedInvoice.price}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="w-full mt-6 bg-emerald-900 text-white py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download / Print
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
