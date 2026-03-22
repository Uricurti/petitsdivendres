'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CounterDisplayProps {
  currentCount: number;
  maxCapacity: number;
}

export const CounterDisplay: React.FC<CounterDisplayProps> = ({ currentCount, maxCapacity }) => {
  const percentage = Math.min((currentCount / maxCapacity) * 100, 100);
  const radius = 95;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const [prevCount, setPrevCount] = useState(currentCount);
  useEffect(() => {
    setPrevCount(currentCount);
  }, [currentCount]);

  const isGoingUp = currentCount >= prevCount;

  return (
    <div className="relative flex items-center justify-center p-2 text-current">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90 drop-shadow-md"
      >
        <circle
          stroke="currentColor"
          className="opacity-10"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut", type: "spring", bounce: 0.15 }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="drop-shadow-sm opacity-90"
        />
        {/* Render dots representing capacity slots */}
        {Array.from({ length: maxCapacity }).map((_, i) => {
          const angle = (i / maxCapacity) * 2 * Math.PI;
          const x = radius + normalizedRadius * Math.cos(angle);
          const y = radius + normalizedRadius * Math.sin(angle);
          const isFilled = i < currentCount;
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={stroke / 3.5}
              fill="currentColor"
              initial={{ opacity: 0.2, scale: 0.8 }}
              animate={{ opacity: isFilled ? 1 : 0.2, scale: isFilled ? 1.2 : 0.8 }}
              transition={{ delay: i * 0.015, type: 'spring' }}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="flex items-baseline justify-center overflow-hidden h-[70px] sm:h-[90px] mt-2">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={currentCount}
              initial={{ y: isGoingUp ? 50 : -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: isGoingUp ? -50 : 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="text-6xl sm:text-7xl font-black tracking-tighter tabular-nums leading-none"
            >
              {currentCount}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="text-lg sm:text-xl font-bold opacity-50 mt-1">/ {maxCapacity}</span>
      </div>
    </div>
  );
};
