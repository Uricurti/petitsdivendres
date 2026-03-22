import React from 'react';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function InfoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-4 relative bg-background text-navy">
      <div className="absolute top-4 left-4">
        <Link href="/" className="p-3 bg-white rounded-full shadow-sm text-navy/60 hover:text-navy transition-colors flex items-center justify-center">
          <ArrowLeft size={24} />
        </Link>
      </div>

      <div className="mt-8 mb-8">
        <Logo className="w-12 h-12" />
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-navy/5 space-y-6">
        <h1 className="text-2xl font-bold text-navy mb-4">Informació Pràctica</h1>
        
        <section>
          <h2 className="text-sm font-semibold text-navy/50 uppercase tracking-widest mb-2">Horari</h2>
          <p className="text-lg">Divendres de 16:30 a 19:00 h</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-navy/50 uppercase tracking-widest mb-2">Aforament Mínim/Màxim</h2>
          <p className="text-lg">Capacitat total de 20 famílies en el mateix moment.</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-navy/50 uppercase tracking-widest mb-2">Preus i Abonaments</h2>
          <ul className="space-y-2 text-lg">
            <li className="flex justify-between border-b border-navy/5 pb-2"><span>Tiquet puntual</span> <span className="font-medium">4,24 €</span></li>
            <li className="flex justify-between border-b border-navy/5 pb-2"><span>Abonament 5 sessions</span> <span className="font-medium">16,94 €</span></li>
            <li className="flex justify-between border-b border-navy/5 pb-2"><span>Abonament 10 sessions</span> <span className="font-medium">33,88 €</span></li>
          </ul>
          <p className="text-sm text-navy/60 mt-3">S'aplica un descompte del 15% per a famílies monoparentals i nombroses.</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-navy/50 uppercase tracking-widest mb-2">Calendari</h2>
          <p className="text-md text-navy/80">L'espai tancarà per vacances de Setmana Santa i finalització de trimestres ordinaris. Consulteu notes del Casal.</p>
        </section>
      </div>
    </main>
  );
}
