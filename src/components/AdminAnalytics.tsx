'use client';

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Clock, Award, Activity } from 'lucide-react';

export const AdminAnalytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="w-full flex justify-center py-10 opacity-50">
        <div className="animate-pulse flex space-x-2 items-center text-navy">
          <Activity className="animate-spin" size={20} />
          <span className="text-sm font-semibold tracking-wide">Carregant Intel·ligència...</span>
        </div>
      </div>
    );
  }

  const chartData = data.hourlyFlow?.map((d: any) => ({
    name: d.time,
    Afluència: d.amount
  })) || [];

  return (
    <div className="w-full space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/60 backdrop-blur-2xl p-5 rounded-3xl shadow-lg border border-white/50"
      >
        <div className="flex items-center space-x-2 text-navy mb-4">
          <Activity size={18} />
          <h3 className="font-semibold text-sm tracking-wide">CORBA DE CALOR D'AVUI</h3>
        </div>
        <div className="h-[140px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#f43f5e', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="Afluència" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorFlow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.1 }}
           className="bg-white/60 backdrop-blur-2xl p-4 rounded-3xl shadow-lg border border-white/50 flex flex-col justify-between"
        >
          <div className="flex items-center text-rose-500 mb-2 opacity-80">
            <Clock size={16} className="mr-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Estat Crític</span>
          </div>
          <div className="flex items-end">
             <span className="text-4xl font-black text-navy leading-none tracking-tighter">{data.peakMinutes}</span>
             <span className="text-xs font-semibold text-navy/50 ml-1 mb-1">minuts</span>
          </div>
          <p className="text-[9px] text-navy/50 mt-1 leading-tight">Temps acumulat a capacitat màxima (20/20).</p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
           className="bg-white/60 backdrop-blur-2xl p-4 rounded-3xl shadow-lg border border-white/50 overflow-hidden relative"
        >
          <div className="flex items-center text-amber-500 mb-3 opacity-80">
            <Award size={16} className="mr-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Top Fidelitat</span>
          </div>
          <div className="flex flex-col space-y-1.5 z-10 relative">
            {data.loyalFamilies && data.loyalFamilies.length > 0 ? (
              data.loyalFamilies.slice(0,3).map((fam: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-white/50 px-2 py-1 rounded-lg">
                  <span className="text-xs font-semibold text-navy truncate max-w-[70px]">{fam.name}</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">{fam.count}x</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-navy/40 italic">Sense històric</span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
