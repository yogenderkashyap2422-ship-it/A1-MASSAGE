import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, onSnapshot, getDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { MapPin, Navigation, X, Clock, User, Tag } from 'lucide-react';
import { motion } from 'motion/react';

const SERVICES = [
  {
    id: 'ladies',
    title: 'Ladies Body Massage',
    price: 500,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800',
    description: 'Premium relaxing body massage and spa services for ladies at home.'
  },
  {
    id: 'gents',
    title: 'Gents Body Massage',
    price: 700,
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800',
    description: 'Professional deep tissue and relaxing massage therapy for men.'
  }
];

export function Services() {
  const { user, openLoginModal } = useAuth();
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [loading, setLoading] = useState(false);

  // Data from Firestore
  const [slots, setSlots] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);

  useEffect(() => {
    const unsubSlots = onSnapshot(query(collection(db, 'slots')), (snapshot) => {
      const activeSlots = snapshot.docs.map(d => ({ id: d.id, ...d.data() })).filter((s: any) => s.active);
      setSlots(activeSlots);
    });
    const unsubStaff = onSnapshot(query(collection(db, 'staff')), (snapshot) => {
      const activeStaff = snapshot.docs.map(d => ({ id: d.id, ...d.data() })).filter((s: any) => s.available);
      setStaffList(activeStaff);
    });
    return () => { unsubSlots(); unsubStaff(); };
  }, []);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [staffId, setStaffId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const applyCoupon = async () => {
    if (!couponCode) return;
    try {
      const couponDoc = await getDoc(doc(db, 'coupons', couponCode.toUpperCase()));
      if (couponDoc.exists() && couponDoc.data().active) {
        setDiscount(couponDoc.data().discount);
        toast.success(`Coupon applied! ₹${couponDoc.data().discount} OFF`);
      } else {
        toast.error('Invalid or expired coupon');
        setDiscount(0);
      }
    } catch (error) {
      toast.error('Error applying coupon');
    }
  };

  const handleGetLocation = () => {
    setGettingLocation(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          setLocation(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (Gurgaon)`);
          toast.success('Location detected!');
        } catch (error) {
          toast.error('Failed to get location details');
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        toast.error('Unable to retrieve your location');
        setGettingLocation(false);
      }
    );
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    if (!user) {
      toast.error('Please login to continue booking');
      openLoginModal();
      return;
    }

    if (!location.toLowerCase().includes('gurgaon')) {
      toast.error('Sorry, we currently only serve locations within Gurgaon.');
      return;
    }

    try {
      setLoading(true);
      
      let finalLat = latitude;
      let finalLng = longitude;

      // Geocode if manual input and no lat/lng
      if (!finalLat || !finalLng) {
        try {
          // Using Nominatim as a free alternative to Google Maps Geocoding API
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ' Gurgaon')}`);
          const data = await response.json();
          if (data && data.length > 0) {
            finalLat = parseFloat(data[0].lat);
            finalLng = parseFloat(data[0].lon);
          }
        } catch (error) {
          console.error("Geocoding failed", error);
        }
      }

      const finalPrice = Math.max(0, selectedService.price - discount);
      const selectedStaff = staffList.find(s => s.id === staffId);

      const orderData: any = {
        userId: user.uid,
        name,
        phone,
        date,
        slotTime,
        address,
        location,
        serviceType: selectedService.title,
        status: 'Pending',
        price: selectedService.price,
        finalPrice,
        couponCode: discount > 0 ? couponCode.toUpperCase() : null,
        discount,
        staffId: staffId || null,
        staffName: selectedStaff ? selectedStaff.name : null,
        createdAt: serverTimestamp()
      };

      if (finalLat !== null && finalLat !== undefined && !isNaN(finalLat) && 
          finalLng !== null && finalLng !== undefined && !isNaN(finalLng)) {
        orderData.latitude = finalLat;
        orderData.longitude = finalLng;
      }

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      toast.success('Booking confirmed successfully!');
      setSelectedService(null);
      
      // Send WhatsApp message
      const message = `Hello SpaHome! I have booked a ${selectedService.title} for ${date} at ${slotTime}. My order ID is ${docRef.id}.`;
      const url = `https://wa.me/919821196616?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');

      // Reset form
      setPhone('');
      setDate('');
      setSlotTime('');
      setStaffId('');
      setCouponCode('');
      setDiscount(0);
      setAddress('');
      setLocation('');
      setLatitude(null);
      setLongitude(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      toast.error('Failed to book service. Please try again.');
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-white">Book Body Massage in Gurgaon</h1>
        <p className="text-emerald-100 mt-2">Select a premium spa service to book a doorstep appointment</p>
      </div>

      <div className="p-6 space-y-6 -mt-6">
        {SERVICES.map((service, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={service.id} 
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="h-56 relative overflow-hidden">
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
              <div className="absolute bottom-4 right-4 bg-amber-500 text-emerald-950 px-4 py-1.5 rounded-full font-bold shadow-lg">
                ₹{service.price} / hr
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
              <p className="text-gray-500 text-sm mt-2 mb-6 leading-relaxed">{service.description}</p>
              <button
                onClick={() => setSelectedService(service)}
                className="w-full bg-emerald-900 text-white py-3.5 rounded-xl font-medium hover:bg-emerald-800 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 bg-emerald-900 text-white">
              <div>
                <h2 className="text-xl font-bold">Book Service</h2>
                <p className="text-sm text-emerald-100">{selectedService.title} - ₹{selectedService.price}/hr</p>
              </div>
              <button 
                onClick={() => setSelectedService(null)}
                className="p-2 hover:bg-emerald-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-emerald-100" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none transition-all"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none transition-all"
                    placeholder="+91 98211 96616"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      required
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        required
                        value={slotTime}
                        onChange={(e) => setSlotTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none transition-all appearance-none bg-white"
                      >
                        <option value="">Select Slot</option>
                        {slots.map(slot => (
                          <option key={slot.id} value={slot.time}>{slot.time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Staff (Optional)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Any Available Staff</option>
                      {staffList.filter(s => selectedService.title.includes(s.gender === 'Female' ? 'Ladies' : 'Gents')).map(staff => (
                        <option key={staff.id} value={staff.id}>{staff.name} ({staff.experience})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none transition-all uppercase"
                        placeholder="e.g. FIRST50"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="px-4 py-3 bg-gray-100 text-emerald-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-emerald-600 font-medium mt-1">Discount applied: ₹{discount} OFF</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">House No / Building No</label>
                  <input
                    required
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none transition-all"
                    placeholder="A-123, Sector 45"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location (Gurgaon Only)</label>
                  <div className="flex gap-2">
                    <input
                      required
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. DLF Phase 1, Gurgaon"
                    />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={gettingLocation}
                      className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center disabled:opacity-50"
                      title="Auto-detect location"
                    >
                      <Navigation className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Must include "Gurgaon"
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 text-emerald-950 py-4 rounded-xl font-bold hover:bg-amber-400 transition-colors disabled:opacity-50 mt-6 shadow-lg shadow-amber-500/20"
                >
                  {loading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
