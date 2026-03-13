import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

function Splash({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      {/* Logo Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-28 h-28 bg-gradient-to-br from-purple-500 to-pink-400 rounded-3xl flex items-center justify-center mb-6 shadow-2xl"
      >
        <Zap size={64} className="text-white" strokeWidth={1.5} />
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-4xl font-black text-white tracking-tight"
      >
        Beast<span className="text-purple-400">Mode</span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-gray-500 mt-2 text-sm tracking-widest uppercase"
      >
        Level Up Every Day
      </motion.p>

      {/* Loading Bar */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '120px', opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.5, ease: 'easeInOut' }}
        className="h-1 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full mt-12"
      />
    </div>
  );
}

export default Splash;