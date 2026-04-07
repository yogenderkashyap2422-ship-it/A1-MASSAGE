import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-full pb-6 bg-gray-50"
    >
      {/* Premium Banner */}
      <div className="relative bg-emerald-900 text-white rounded-b-[2.5rem] overflow-hidden shadow-2xl">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-900/80 to-transparent z-10 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900 via-emerald-900/80 to-emerald-900/40 z-10 md:hidden" />
        
        <div className="flex flex-col md:flex-row relative z-20">
          {/* Image Content (Stacks on top for mobile, right for desktop) */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800" 
              alt="Premium Massage Service"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Text Content */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left order-2 md:order-1">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight text-white">
                Premium Spa & <br className="hidden md:block" /> Massage
              </h1>
              
              <div className="space-y-4 mb-8 text-emerald-50">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-400" />
                  <span className="font-medium text-lg">10+ Years Experience</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-400" />
                  <span className="font-medium text-lg">24/7 Service Available</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-400" />
                  <span className="font-medium text-lg">Ladies & Gents Service</span>
                </div>
              </div>
              
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 bg-amber-500 text-emerald-950 px-8 py-4 rounded-full font-bold hover:bg-amber-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-amber-500/30"
              >
                Book Now <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
