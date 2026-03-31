"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// ROBUST COORDINATE-BASED TEMPLATES
// Percentages (%) used for x, y, width, height relative to frame container
export const TEMPLATES = [
  {
    id: 1,
    name: 'Classic Pink Stars',
    category: 'Birthday',
    frameUrl: '/templates/pink-stars.webp',
    bg: '#FFFFFF',
    photoCount: 4,
    orientation: 'portrait',
    slots: [
      // LEFT STRIP (1, 2, 3, 4)
      { x: 7, y: 5.5, w: 36, h: 18, pattern: 1 },
      { x: 7, y: 26.5, w: 36, h: 18, pattern: 2 },
      { x: 7, y: 47.8, w: 36, h: 18, pattern: 3 },
      { x: 7, y: 69, w: 36, h: 18, pattern: 4 },

      // RIGHT STRIP (4, 3, 2, 1)
      { x: 57, y: 5.5, w: 36, h: 18, pattern: 4 },
      { x: 57, y: 26.5, w: 36, h: 18, pattern: 3 },
      { x: 57, y: 47.8, w: 36, h: 18, pattern: 2 },
      { x: 57, y: 69, w: 36, h: 18, pattern: 1 },
    ]
  }
];

const categories = ["All", "Birthday", "Wedding", "Party"];

import { SessionTimer } from '@/components/SessionTimer';

// ... (skipping to component start)
export default function TemplateSelectionPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [activeCategory, setActiveCategory] = useState("All");

  const handleStart = () => {
    if (selectedId) {
      localStorage.setItem('selectedTemplateId', selectedId.toString());
      router.push('/capture');
    }
  };

  const filteredTemplates = activeCategory === "All"
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="bg-[#F9FAFB] text-[#1A1A1A] min-h-screen flex flex-col select-none">

      <SessionTimer />

      {/* Cinematic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]"></div>
      </div>

      <main className="flex-1 w-full max-w-[1500px] mx-auto px-12 pb-20 pt-4 relative z-10 flex flex-col">
        <header className="mb-16 text-left">
          <h1 className="text-5xl font-black editorial-text tracking-tighter mb-3 italic">Gallery.</h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.6em] uppercase italic">Curated Canvas Selection</p>
        </header>

        <div className="flex flex-wrap justify-center gap-16 pb-48">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedId(template.id)}
              className="relative cursor-pointer group flex flex-col items-center"
            >
              {/* PREVIEW CONTAINER */}
              <div className={`relative transition-all duration-500 ${selectedId === template.id ? 'scale-105' : 'group-hover:scale-102 opacity-60'
                }`}>

                <div
                  className="relative shadow-2xl overflow-hidden border-4 border-white bg-white rounded-md w-[280px] md:w-[350px] aspect-[1/1.52]"
                  style={{ backgroundColor: template.bg }}
                >
                  {/* ABSOLUTE COORDINATE SLOTS (BEHIND) */}
                  <div className="absolute inset-0 z-0">
                    {template.slots.map((slot, i) => (
                      <div
                        key={i}
                        className="absolute bg-slate-50/50 border border-black/[0.03] flex items-center justify-center font-black text-xs text-slate-300"
                        style={{
                          left: `${slot.x}%`,
                          top: `${slot.y}%`,
                          width: `${slot.w}%`,
                          height: `${slot.h}%`,
                        }}
                      >
                        {slot.pattern}
                      </div>
                    ))}
                  </div>

                  {/* FRAME OVERLAY (FRONT) */}
                  <img
                    src={template.frameUrl}
                    className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
                    alt="Frame"
                  />
                </div>

                {/* Selection Indicator */}
                {selectedId === template.id && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="w-16 h-16 rounded-2xl bg-white text-primary flex items-center justify-center shadow-3xl border-4 border-primary/20"
                    >
                      <Check size={32} strokeWidth={4} />
                    </motion.div>
                  </div>
                )}
              </div>

              <div className={`mt-10 text-center transition-all ${selectedId === template.id ? 'opacity-100' : 'opacity-40'}`}>
                <h3 className="text-base font-black uppercase tracking-[0.4em] mb-2">{template.name}</h3>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-8 h-px bg-slate-200"></div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic font-serif">Studio Asset Edition</span>
                  <div className="w-8 h-px bg-slate-200"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-3xl border-t border-slate-100 py-6 px-12 z-50 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-105'
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={!selectedId}
          onClick={handleStart}
          className="group flex items-center gap-3 bg-blue-600 text-white px-28 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.6em] shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
        >
          MULAI
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </footer>
    </div>
  );
}
