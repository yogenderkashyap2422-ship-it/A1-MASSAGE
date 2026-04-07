import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { MapPin, Navigation, X } from 'lucide-react';
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
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

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
          setLocation(`Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)} (Gurgaon)`);
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
    if (!selectedService || !user) return;

    if (!location.toLowerCase().includes('gurgaon')) {
      toast.error('Sorry, we currently only serve locations within Gurgaon.');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        userId: user.uid,
        name,
        phone,
        dateTime,
        address,
        location,
        serviceType: selectedService.title,
        status: 'Pending',
        price: selectedService.price,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      toast.success('Booking confirmed successfully!');
      setSelectedService(null);
      
      // Reset form
      setPhone('');
      setDateTime('');
      setAddress('');
      setLocation('');
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
        <h1 className="text-3xl font-bold text-white">Our Services</h1>
        <p className="text-emerald-100 mt-2">Select a premium service to book an appointment</p>
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
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input
                    required
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none transition-all"
                  />
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
