import { motion } from 'motion/react';
import { Info, CheckCircle2 } from 'lucide-react';

export function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-full pb-6 bg-gray-50"
    >
      <div className="bg-emerald-900 px-6 py-8 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center gap-3 text-white mb-2">
          <Info className="w-8 h-8" />
          <h1 className="text-3xl font-bold">About Us</h1>
        </div>
        <p className="text-emerald-100">Premium Spa & Massage Services in Gurgaon</p>
      </div>

      <div className="p-6 -mt-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            SpaHome was founded with a simple mission: to bring premium, professional, and relaxing spa services directly to your doorstep in Gurgaon. We understand that in today's fast-paced world, finding time to visit a spa can be challenging. That's why we bring the spa to you.
          </p>
          <p className="text-gray-600 leading-relaxed">
            With over 10 years of experience in the wellness industry, our team of certified therapists is dedicated to providing you with the highest quality massage therapies tailored to your specific needs.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900">Certified Therapists</h3>
                <p className="text-sm text-gray-600">All our professionals are highly trained and certified.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900">24/7 Availability</h3>
                <p className="text-sm text-gray-600">We work around your schedule, day or night.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900">Premium Products</h3>
                <p className="text-sm text-gray-600">We use only high-quality, skin-friendly oils and lotions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
