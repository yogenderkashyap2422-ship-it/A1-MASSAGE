import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-full pb-6 bg-gray-50"
    >
      <div className="bg-emerald-900 px-6 py-8 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center gap-3 text-white mb-2">
          <Shield className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-emerald-100">How we handle your data</p>
      </div>

      <div className="p-6 -mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 prose prose-emerald max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly to us when you book a service, create an account, or contact us for support. This may include your name, email address, phone number, and location details for home service.</p>
          
          <h3>2. How We Use Your Information</h3>
          <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send you related information, and respond to your comments and questions.</p>
          
          <h3>3. Data Security</h3>
          <p>We implement appropriate technical and organizational measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
          
          <h3>4. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at Yogenderkashyap2422@gmail.com.</p>
        </div>
      </div>
    </motion.div>
  );
}
