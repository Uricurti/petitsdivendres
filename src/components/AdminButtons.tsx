import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminButtonsProps {
  onIncrement: () => void;
  onDecrement: () => void;
  disableIncrement: boolean;
  disableDecrement: boolean;
  isOpen: boolean;
}

export const AdminButtons: React.FC<AdminButtonsProps> = ({ 
  onIncrement, 
  onDecrement, 
  disableIncrement, 
  disableDecrement,
  isOpen
}) => {
  return (
    <div className="flex space-x-6 w-full justify-center mt-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onDecrement}
        disabled={disableDecrement || !isOpen}
        className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-3xl flex items-center justify-center shadow-md border hover:border-rose-200 border-navy/5 text-rose-500 disabled:opacity-40 disabled:bg-gray-50 transition-colors"
      >
        <Minus size={64} strokeWidth={2.5} />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onIncrement}
        disabled={disableIncrement || !isOpen}
        className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-3xl flex items-center justify-center shadow-md border hover:border-emerald-200 border-navy/5 text-emerald-500 disabled:opacity-40 disabled:bg-gray-50 transition-colors"
      >
        <Plus size={64} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
};
