import React from 'react';
import Image from 'next/image';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`flex items-center space-x-2`}>
      <div className={`relative ${className} shrink-0 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full overflow-hidden shadow-sm p-1 border border-white/50 dark:border-white/10`}>
        <Image src="/logo1.png" alt="Petits Divendres Logo" fill priority className="object-cover rounded-full mix-blend-multiply dark:mix-blend-normal" />
      </div>
      <div className="flex flex-col justify-center">
        <span className="font-bold text-current leading-none tracking-wider text-sm sm:text-base">PETITS</span>
        <span className="font-bold text-current opacity-80 leading-none tracking-wider text-sm sm:text-base mt-[1px]">DIVENDRES</span>
      </div>
    </div>
  );
};
