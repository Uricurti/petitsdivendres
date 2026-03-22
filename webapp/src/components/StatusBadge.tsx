'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type StatusType = 'Lliure' | 'Quasi ple' | 'Ple' | 'Tancat';

interface StatusBadgeProps {
  status: StatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorClass = 'bg-gray-200 text-gray-500'; // Tancat o gris
  
  if (status === 'Lliure') {
    colorClass = 'bg-mint/20 text-emerald-800'; // light mint
  } else if (status === 'Quasi ple') {
    colorClass = 'bg-warm/30 text-amber-800'; // warm orange-yellow
  } else if (status === 'Ple') {
    colorClass = 'bg-reddish/20 text-rose-800'; // reddish pink
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <span className="text-sm font-medium text-navy/60 uppercase tracking-wider">Estat de l'espai</span>
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className={`px-6 py-2 rounded-full font-semibold text-lg flex items-center justify-center shadow-sm ${colorClass}`}
        >
          {status === 'Lliure' && <span className="mr-2 w-3 h-3 rounded-full bg-emerald-500" />}
          {status === 'Quasi ple' && <span className="mr-2 w-3 h-3 rounded-full bg-amber-500" />}
          {status === 'Ple' && <span className="mr-2 w-3 h-3 rounded-full bg-rose-500" />}
          {status === 'Tancat' && <span className="mr-2 w-3 h-3 rounded-full bg-gray-400" />}
          {status}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
