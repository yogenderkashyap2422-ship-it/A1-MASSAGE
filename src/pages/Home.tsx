import { ArrowRight, CheckCircle2, Star, MapPin, Phone, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { TopBannerAd, InContentAd } from '../components/Ads';

export function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-full pb-12 bg-gray-50"
    >
      <TopBannerAd />
      
      {/* Hero Section */}
      <div className="relative bg-emerald-900 text-white rounded-b-[2.5rem] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-900/80 to-transparent z-10 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900 via-emerald-900/80 to-emerald-900/40 z-10 md:hidden" />
        
        <div className="flex flex-col md:flex-row relative z-20">
          <div className="w-full md:w-1/2 h-64 md:h-auto relative order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800" 
              alt="body massage service in Gurgaon"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left order-2 md:order-1">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight text-white">
                Best Body Massage in Gurgaon | 24/7 Home Service
              </h1>
              <p className="text-emerald-100 mb-6 text-lg">
                Book professional body massage services in Gurgaon. Enjoy a relaxing spa at home with our doorstep massage service.
              </p>
              
              <div className="space-y-4 mb-8 text-emerald-50">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-400" />
                  <span className="font-medium text-lg">Professional Massage Service Gurgaon</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-400" />
                  <span className="font-medium text-lg">24/7 Massage Service Gurgaon</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-400" />
                  <span className="font-medium text-lg">Female to Female & Male to Male</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link 
                  to="/services" 
                  className="inline-flex items-center gap-2 bg-amber-500 text-emerald-950 px-8 py-4 rounded-full font-bold hover:bg-amber-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-amber-500/30"
                >
                  Book Now Massage Gurgaon <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href="https://wa.me/919821196616" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="px-6 py-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Massage Centre in Gurgaon?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We are recognized as the best massage centre in Gurgaon, offering affordable and premium spa services right at your doorstep.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Availability</h3>
            <p className="text-gray-600">Instant booking available anytime. We provide Gurgaon home service massage round the clock.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Trusted Professionals</h3>
            <p className="text-gray-600">Our therapists are highly trained. We offer safe female to female massage Gurgaon and male to male massage.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Massage Near Me</h3>
            <p className="text-gray-600">Serving all areas including Sector 14, Sector 22, DLF Phase 1-5, and all major Gurgaon locations.</p>
          </div>
        </div>
      </div>

      <div className="px-6 max-w-7xl mx-auto w-full">
        <InContentAd />
      </div>

      {/* Services Section */}
      <div className="bg-emerald-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Premium Spa Services in Gurgaon</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">Experience the ultimate relaxation with our specialized therapies.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-emerald-800 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Deep Tissue Massage Gurgaon</h3>
              <p className="text-emerald-50 mb-6">Perfect for relieving chronic muscle tension. Our deep tissue therapy focuses on the deepest layers of muscle tissue, tendons, and fascia.</p>
              <Link to="/services" className="text-white font-bold hover:text-amber-400 flex items-center gap-2">Explore Service <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-emerald-800 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Relaxation Massage Gurgaon</h3>
              <p className="text-emerald-50 mb-6">A smooth, gentle, flowing style that promotes general relaxation, relieves muscular tension, and improves circulation and movement range.</p>
              <Link to="/services" className="text-white font-bold hover:text-amber-400 flex items-center gap-2">Explore Service <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="px-6 py-16 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Benefits of Full Body Massage Gurgaon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 items-start">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Stress Relief & Relaxation</h3>
              <p className="text-gray-600">A professional spa at home in Gurgaon helps lower heart rate and blood pressure, relaxing your mind and body.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Improved Circulation</h3>
              <p className="text-gray-600">Our affordable body massage Gurgaon improves blood flow, delivering oxygen and nutrients to your cells.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pain Management</h3>
              <p className="text-gray-600">Effectively reduces chronic pain, muscle soreness, and tension through targeted deep tissue techniques.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Better Sleep Quality</h3>
              <p className="text-gray-600">Regular massage therapy promotes deeper, more restful sleep by increasing serotonin levels.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rahul S.", text: "Best massage centre in Gurgaon! The doorstep service was incredibly convenient and professional.", location: "Sector 14" },
              { name: "Priya M.", text: "I booked a female to female massage. The therapist was excellent and very respectful. Highly recommended spa near me.", location: "DLF Phase 3" },
              { name: "Amit K.", text: "Affordable body massage Gurgaon with premium quality. The deep tissue massage relieved all my back pain.", location: "Sector 22" }
            ].map((review, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-600 mb-4 italic">"{review.text}"</p>
                <div className="font-bold text-gray-900">{review.name}</div>
                <div className="text-sm text-gray-500">{review.location}, Gurgaon</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="px-6 py-16 max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Do you provide home massage service in Gurgaon?</h3>
            <p className="text-gray-600">Yes, we specialize in doorstep massage service across all sectors in Gurgaon, available 24/7.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Are your therapists certified?</h3>
            <p className="text-gray-600">Absolutely. We provide professional massage service in Gurgaon with highly trained and certified therapists.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">How can I book an instant massage near me?</h3>
            <p className="text-gray-600">You can click on "Book Now Massage Gurgaon" or use our WhatsApp button for instant booking available 24/7.</p>
          </div>
        </div>
      </div>

      {/* Map & Contact */}
      <div className="px-6 py-16 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Spa Near Me in Gurgaon</h2>
            <p className="text-gray-600 mb-8">We serve the entire Gurugram region. Call now for massage service at your location.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-gray-700">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Call Us 24/7</div>
                  <div>+91 98211 96616</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Email Us</div>
                  <a href="mailto:Yogenderkashyap2422@gmail.com" className="hover:text-emerald-600 transition-colors">Yogenderkashyap2422@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Service Area</div>
                  <div>All Sectors, Gurgaon, Haryana</div>
                </div>
              </div>
            </div>
            
            <a 
              href="tel:+919821196616" 
              className="inline-flex items-center justify-center gap-2 bg-emerald-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-800 transition-colors"
            >
              <Phone className="w-5 h-5" /> Call Now for Massage Service
            </a>
          </div>
          <div className="w-full md:w-1/2 h-64 md:h-auto min-h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d76.84966258814002!3d28.42318105021208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0x2cf5fe8e5c64b1e!2sGurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1709660000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Massage Centre in Gurgaon Map"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919821196616"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold pl-0 group-hover:pl-3">
          Instant Booking
        </span>
      </a>
    </motion.div>
  );
}
