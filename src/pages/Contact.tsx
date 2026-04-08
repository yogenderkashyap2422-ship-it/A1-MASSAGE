import { motion } from 'motion/react';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-full pb-6 bg-gray-50"
    >
      <div className="bg-emerald-900 px-6 py-8 rounded-b-[2rem] shadow-lg">
        <h1 className="text-3xl font-bold text-white">Contact Us</h1>
        <p className="text-emerald-100 mt-2">We're here to help you 24/7</p>
      </div>

      <div className="p-6 -mt-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-500 font-medium">Call Us 24/7</div>
                <a href="tel:+919821196616" className="text-lg font-bold text-gray-900 hover:text-emerald-600 transition-colors">
                  +91 98211 96616
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-500 font-medium">Email Us</div>
                <a href="mailto:Yogenderkashyap2422@gmail.com" className="text-lg font-bold text-gray-900 hover:text-emerald-600 transition-colors break-all">
                  Yogenderkashyap2422@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-500 font-medium">Service Area</div>
                <div className="text-lg font-bold text-gray-900">
                  All Sectors, Gurgaon
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Send a Message</h2>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea required rows={4} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-900 outline-none resize-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-emerald-900 text-white py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
