import React, { useState, useEffect } from 'react';
import { Plus, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AttendanceManagerProps {
  isOpen: boolean;
  onCountUpdate: (newCount: number) => void;
  maxCapacity: number;
  currentCount: number;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({ isOpen, onCountUpdate, maxCapacity, currentCount }) => {
  const [name, setName] = useState('');
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchAttendances = async () => {
    try {
      const res = await fetch('/api/attendance');
      if (res.ok) {
        const data = await res.json();
        setAttendances(data.attendances || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAttendances();
    } else {
      setAttendances([]);
      setShowModal(false);
    }
  }, [isOpen]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      });
      const data = await res.json();
      
      if (res.ok) {
        onCountUpdate(data.newCount);
        setName('');
        fetchAttendances();
      } else {
        setError(data.error || 'Error al registrar nen');
      }
    } catch (err) {
      setError('Error de xarxa');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (attendanceId: string) => {
    setError('');
    try {
      setAttendances(prev => prev.filter(a => a.id !== attendanceId));
      
      const res = await fetch('/api/attendance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendance_id: attendanceId })
      });
      const data = await res.json();
      if (res.ok) {
        onCountUpdate(data.newCount);
      } else {
        fetchAttendances();
        setError(data.error);
      }
    } catch (err) {
      fetchAttendances();
      setError('Error de xarxa en marxar');
    }
  };

  return (
    <>
      <div className="w-full space-y-6 mt-6">
        <form onSubmit={handleAdd} className="bg-white/85 backdrop-blur-2xl p-4 sm:p-6 rounded-3xl shadow-xl border border-white/50 flex flex-col space-y-3">
          <h3 className="font-semibold text-navy text-lg drop-shadow-sm">Registrar Família</h3>
          
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Nom de referència"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={!isOpen || currentCount >= maxCapacity || loading}
              className="flex-1 px-4 py-3 rounded-xl border border-navy/10 text-navy bg-white/50 focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent text-lg disabled:opacity-50 transition-colors"
            />
            <button
              type="submit"
              disabled={!name.trim() || !isOpen || currentCount >= maxCapacity || loading}
              className="bg-emerald-500 hover:bg-emerald-600 shadow-md text-white rounded-xl px-4 py-3 disabled:opacity-50 transition-all flex items-center justify-center"
            >
              <Plus size={24} />
            </button>
          </div>
          
          {error && <p className="text-rose-500 text-sm font-medium">{error}</p>}
          {currentCount >= maxCapacity && <p className="text-warm text-sm font-medium">Aforament ple, espereu que algú marxi.</p>}
          {!isOpen && <p className="text-navy/60 text-sm font-medium">La recepció està aturada.</p>}
        </form>

        <div className="w-full">
          <button 
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full bg-white/80 backdrop-blur-xl hover:bg-white transition-all shadow-md px-4 py-4 rounded-3xl border border-white/50 flex items-center justify-between text-navy mb-4 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center group-hover:bg-mint group-hover:text-navy transition-colors">
                <Users size={20} />
              </div>
              <span className="font-semibold text-lg">Consultar Actius</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-navy/10 text-navy px-3 py-1 rounded-full text-sm font-bold">{attendances.length} famílies</span>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/40 backdrop-blur-md p-4 sm:p-8"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-full max-h-[80vh] border border-white/40"
            >
              <div className="flex-none p-6 border-b border-navy/5 flex justify-between items-center bg-white/95">
                <div>
                  <h2 className="text-xl font-bold text-navy">Famílies a la Ludoteca</h2>
                  <p className="text-sm text-navy/60 font-medium">{attendances.length} famílies actualment jugant</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy/60 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-50/50">
                {attendances.length === 0 && (
                  <div className="text-center py-12 text-navy/40 font-medium">Sense registres actius.</div>
                )}
                {attendances.map(att => {
                  const childName = Array.isArray(att.children) ? att.children[0]?.name : att.children?.name;
                  const timeString = new Date(att.check_in_time).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div 
                      key={att.id}
                      className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-navy/5"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-navy text-lg">{childName}</span>
                        <span className="text-xs text-navy/50 font-medium">Hora check-in: {timeString}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleRemove(att.id)}
                        className="px-4 py-2 rounded-xl flex items-center space-x-2 bg-rose-50 hover:bg-rose-100 text-rose-500 font-semibold text-sm transition-colors border border-rose-100"
                      >
                        <X size={16} />
                        <span>Marxa</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
