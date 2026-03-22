'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CounterDisplayProps {
  currentCount: number;
  maxCapacity: number;
}

export const CounterDisplay: React.FC<CounterDisplayProps> = ({ currentCount, maxCapacity }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-12 border border-navy/5">
      <h2 className="text-xl sm:text-2xl font-medium text-navy/70 mb-4">Aforament Actual</h2>
      <div className="flex items-baseline space-x-2">
        <motion.span 
          key={currentCount}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-7xl sm:text-9xl font-bold text-navy tracking-tighter tabular-nums"
        >
          {currentCount}
        </motion.span>
        <span className="text-3xl sm:text-5xl font-light text-navy/40">/ {maxCapacity}</span>
      </div>
      <p className="mt-4 text-navy/50 font-medium">famílies</p>
    </div>
  );
};
