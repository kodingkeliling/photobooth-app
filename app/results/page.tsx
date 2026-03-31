"use client";

import React, { useEffect, useState, memo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QrCode, RefreshCw, Clock, Download, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEMPLATES } from '../templates/page';

// ISOLATED COUNTDOWN COMPONENT
const SessionCountdown = ({ initialTime, onFinish }: { initialTime: number, onFinish: () => void }) => {
  const [timer, setTimer] = useState(initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center gap-3 pt-4 w-full relative z-10">
      <div className="flex items-center gap-2 text-primary font-black">
        <Clock size={20} />
        <span className="text-3xl font-black tracking-tighter uppercase italic">{timer}S Remaining</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: `${(timer / initialTime) * 100}%` }}
          transition={{ duration: 1, ease: 'linear' }}
          className="h-full bg-primary shadow-glow"
        />
      </div>
    </div>
  );
};

// COORDINATE-BASED FRAME RENDERER
const FinalFrameResult = memo(({ template, photos }: { template: any, photos: string[] }) => {
  if (!template || !photos.length) return null;

  return (
    <div
      className="relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-white flex flex-col items-center flex-shrink-0 origin-center select-none overflow-hidden"
      style={{
        width: '400px',
        height: '600px',
        backgroundColor: template.bg
      }}
    >
      {/* LAYER 0: PHOTOS MAPPED BY COORDINATES (BEHIND) */}
      <div className="absolute inset-0 z-0 h-full w-full">
        {template.slots.map((slot: any, i: number) => {
          const photoUrl = photos[slot.pattern - 1];
          return (
            <div
              key={i}
              className="absolute bg-slate-50 overflow-hidden"
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: `${slot.w}%`,
                height: `${slot.h}%`,
              }}
            >
              <img
                src={photoUrl}
                className="w-full h-full object-cover scale-x-[-1]"
                alt={`Shot ${i}`}
              />
            </div>
          );
        })}
      </div>

      {/* LAYER 1: THE PNG FRAME OVERLAY (FRONT) */}
      <div className="absolute inset-0 pointer-events-none z-10 w-full h-full">
        <img
          src={template.frameUrl}
          className="w-full h-full object-contain"
          alt="Frame"
        />
      </div>
    </div>
  );
});

FinalFrameResult.displayName = "FinalFrameResult";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const publicId = searchParams.get('id');
  const resultRef = useRef<HTMLDivElement>(null);

  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [gifIndex, setGifIndex] = useState(0);

  useEffect(() => {
    // Determine the real URL for the QR
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    const savedPhotos = localStorage.getItem('capturedPhotos');
    const savedTemplateId = localStorage.getItem('selectedTemplateId');

    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    if (savedTemplateId) {
      const t = TEMPLATES.find(temp => temp.id === parseInt(savedTemplateId));
      setSelectedTemplate(t || TEMPLATES[0]);
    }

    // SIMULATED GIF ANIMATION - 1 SECOND INTERVAL
    const interval = setInterval(() => {
      setGifIndex(prev => (prev + 1) % 4);
    }, 1000);
    return () => clearInterval(interval);
  }, [publicId]);

  const handleRestart = () => {
    localStorage.removeItem('capturedPhotos');
    localStorage.removeItem('selectedTemplateId');
    localStorage.removeItem('sessionDeadline');
    router.push('/payment');
  };

  // REDIRECT IF EMPTY SESSION
  useEffect(() => {
    // Wait for state to be hydrated from localStorage
    const timer = setTimeout(() => {
      if (!photos.length || !selectedTemplate) {
        router.push('/payment');
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [photos, selectedTemplate, router]);

  if (!photos.length || !selectedTemplate) return (
    <div className="bg-[#EBEEF2] h-screen w-full flex items-center justify-center">
      <RefreshCw className="animate-spin text-blue-600 opacity-20" size={48} />
    </div>
  );

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="bg-[#EBEEF2] h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">

      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[100px] pointer-events-none"></div>

      <main className="max-w-[1400px] w-full grid lg:grid-cols-12 gap-12 items-center relative z-10 flex-1">

        {/* LARGE FRAME RESULT */}
        <div ref={resultRef} className="lg:col-span-7 flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="drop-shadow-[0_60px_100px_rgba(0,0,0,0.1)] py-8"
          >
            <FinalFrameResult template={selectedTemplate} photos={photos} />
          </motion.div>
        </div>

        {/* SCAN AREA */}
        <div className="lg:col-span-5 flex flex-col gap-6 items-center lg:items-start shrink-0 h-full justify-center">
          <section className="bg-white/90 backdrop-blur-3xl p-4 rounded-lg shadow-[0_50px_80px_-20px_rgba(0,0,0,0.05)] border-4 border-white w-full max-w-sm flex flex-col items-center relative overflow-hidden">

            {/* QR Section */}
            <div className="bg-slate-50/50 rounded-[40px] mb-6 relative border border-slate-100">
              <div className="w-40 h-40 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                <img
                  src={qrUrl}
                  alt="Download QR"
                  className="w-full h-full object-contain"
                />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-200"
              >
                <Sparkles size={20} />
              </motion.div>
            </div>

            {/* ANIMATED GIF PREVIEW - INSTANT SNAPPING */}
            <div className="w-full px-2">
              <div className="w-full h-64 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white relative bg-slate-100 group">
                {photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-none ${gifIndex === i ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    alt={`GIF frame ${i}`}
                  />
                ))}
                {/* <div className="absolute top-4 left-4 bg-blue-600 shadow-xl shadow-blue-200 text-[10px] text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest z-20">Instant Studio GIF</div> */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10"></div>
              </div>
            </div>

            <div className="w-full relative z-10 pt-4 border-t border-slate-50">
              <SessionCountdown initialTime={60} onFinish={handleRestart} />
            </div>
          </section>

          <button
            onClick={handleRestart}
            className="w-full max-w-sm bg-blue-600 text-white py-6 rounded-full font-black text-[11px] uppercase tracking-[0.6em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95 shadow-2xl shadow-blue-200 group"
          >
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-1000" /> RESET SESSION
          </button>
        </div>
      </main>

      <footer className="py-4 text-[9px] font-black text-slate-300 uppercase tracking-[2em] opacity-40 select-none italic font-serif">
        ELECTRIC STUDIO • CINEMATIC EXPERIENCE
      </footer>
    </div>
  );
}
