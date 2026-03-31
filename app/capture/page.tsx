"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, RefreshCw, CheckCircle2, ArrowLeft, Timer, RotateCcw, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEMPLATES } from '../templates/page';
import { SessionTimer } from '@/components/SessionTimer';

export default function CapturePage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlash, setIsFlash] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // New: Cycle countdown settings
  const [selectedCountdown, setSelectedCountdown] = useState<number>(3);
  // Retake counts for cada photo
  const [retakeCounts, setRetakeCounts] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const photoCount = selectedTemplate?.photoCount || 4;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Camera & Template
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    startCamera();

    // Load template for preview aspect ratio
    const savedTemplateId = localStorage.getItem('selectedTemplateId');
    if (savedTemplateId) {
      const t = TEMPLATES.find((temp: any) => temp.id === parseInt(savedTemplateId));
      setSelectedTemplate(t);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Calculate dynamic aspect ratio from template slots
  const previewAspectRatio = '1 / 0.9';

  const takePhotoEffect = () => {
    if (photos.length >= photoCount || countdown !== null) return;
    setRetakeIndex(null);
    setCountdown(selectedCountdown);
  };

  const cycleCountdown = () => {
    const sequence = [3, 5, 10];
    const nextIndex = (sequence.indexOf(selectedCountdown) + 1) % sequence.length;
    setSelectedCountdown(sequence[nextIndex]);
  };

  const handleRetake = (index: number) => {
    if (countdown !== null) return;
    if (retakeCounts[index] >= 3) {
      alert(`Maximum retakes (3x) reached for photo #${index + 1}.`);
      return;
    }

    setRetakeIndex(index);
    setCountdown(selectedCountdown);
  };

  useEffect(() => {
    if (countdown === 0) {
      setCountdown(null);
      captureActualPhoto();
    }

    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const captureActualPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      setIsFlash(true);
      setTimeout(() => setIsFlash(false), 150);

      const imageData = canvas.toDataURL('image/jpeg', 0.9);

      if (retakeIndex !== null) {
        setPhotos(prev => {
          const newPhotos = [...prev];
          newPhotos[retakeIndex] = imageData;
          return newPhotos;
        });
        setRetakeCounts(prev => {
          const newCounts = [...prev];
          newCounts[retakeIndex] += 1;
          return newCounts;
        });
        setRetakeIndex(null);
      } else {
        setPhotos(prev => [...prev, imageData]);
      }
    }
  };

  // AUTO SCROLL TO ACTIVE OR NEW SLOT
  useEffect(() => {
    let focusIndex = photos.length; // Default to next empty slot

    if (retakeIndex !== null) {
      // Focus on the slot being retake
      focusIndex = retakeIndex;
    } else if (photos.length > 0 && countdown === null) {
      // Focus on the photo that was just taken
      focusIndex = photos.length - 1;
    }

    if (focusIndex >= 0 && focusIndex < photoCount) {
      const targetSlot = scrollContainerRef.current?.children[focusIndex] as HTMLElement;
      if (targetSlot) {
        targetSlot.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [photos.length, retakeIndex, countdown]);

  useEffect(() => {
    if (photos.length === photoCount && retakeIndex === null) {
      console.log("All photos captured. Ready for finish.");
    }
  }, [photos, retakeIndex]);

  const handleFinish = () => {
    if (photos.length === photoCount) {
      localStorage.setItem('capturedPhotos', JSON.stringify(photos));
      if (stream) stream.getTracks().forEach(track => track.stop());
      router.push('/results');
    }
  };

  return (
    <div className="bg-surface text-on-surface h-[100dvh] max-h-[100dvh] grid lg:grid-cols-12 overflow-hidden select-none relative">
      <canvas ref={canvasRef} className="hidden" />

      <SessionTimer />

      {/* Main Capture Area - EXPANDED TO FULL CONTENT */}
      <main className="lg:col-span-9 relative bg-black flex items-center justify-center h-full overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full bg-slate-900 flex items-center justify-center transition-all">

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />

            <AnimatePresence>
              {isFlash && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-white"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  key={countdown}
                  initial={{ opacity: 0, scale: 2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 z-40 flex items-center justify-center text-white text-[120px] md:text-[200px] editorial-text font-black drop-shadow-2xl"
                >
                  {countdown}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

            {/* Viewfinder elements */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/20"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/20"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/20"></div>
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/20"></div>

          </div>

          <div className="absolute bottom-8 left-0 w-full flex items-center justify-center px-10 gap-6 md:gap-10">
            <button
              onClick={takePhotoEffect}
              disabled={countdown !== null || photos.length >= photoCount}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all scale-100 hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-50 ${photos.length >= photoCount ? 'bg-green-600' : 'bg-blue-600'}`}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
                {photos.length >= photoCount ? <CheckCircle2 size={32} className="text-white" /> : <Camera size={32} className="text-white" />}
              </div>
            </button>

            {/* Cycle countdown settings button */}
            <button
              onClick={cycleCountdown}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-xl text-white flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all active:scale-90 relative"
            >
              <Timer size={24} />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-[8px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">{selectedCountdown}s</span>
            </button>
          </div>
        </div>
      </main>

      {/* Right Sidebar: Preview Taken Photos */}
      <aside className="lg:col-span-3 bg-surface p-6 md:px-8 flex flex-col items-start border-l border-surface-variant/30 h-full max-h-screen">
        <header className="mb-6 text-left w-full shrink-0">
          <h2 className="text-xl md:text-2xl editorial-text font-bold mb-1">My Photos</h2>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">{photos.length}/{photoCount} CAPTURED</p>
        </header>

        {/* Dynamic height photo list - SPACED OUT FOR BETTER VISUALS */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex flex-col gap-8 w-full max-w-[320px] overflow-y-auto overflow-x-hidden no-scrollbar px-4 pt-12 pb-20 scroll-smooth"
        >
          {Array.from({ length: photoCount }).map((_, i) => {
            const isCapturing = retakeIndex === i || (photos.length === i && countdown !== null);

            return (
              <motion.div
                key={i}
                initial={false}
                animate={photos[i] ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.95 }}
                className={`shrink-0 rounded-[28px] overflow-hidden bg-surface-container-high border-2 transition-all relative scroll-mt-32 ${photos[i] ? 'border-primary shadow-2xl' : 'border-dashed border-primary/10'} ${isCapturing ? 'border-blue-600 ring-4 ring-blue-600/20' : ''}`}
                style={{ aspectRatio: previewAspectRatio }}
              >
                {photos[i] ? (
                  <>
                    <img src={photos[i]} className="w-full h-full object-cover scale-x-[-1]" alt={`Capture ${i + 1}`} />

                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                      {retakeCounts[i] < 3 && (
                        <button
                          onClick={() => handleRetake(i)}
                          disabled={countdown !== null}
                          className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 group hover:bg-blue-700"
                        >
                          <RotateCcw size={16} className="group-hover:rotate-[-90deg] transition-transform" />
                        </button>
                      )}
                      {retakeCounts[i] > 0 && (
                        <span className="bg-black/60 backdrop-blur-md text-[8px] text-white px-2 py-0.5 rounded-full font-bold uppercase">
                          {3 - retakeCounts[i]} left
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/10 italic text-xl font-black">
                    {i + 1}
                  </div>
                )}

                {isCapturing && (
                  <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[2px] flex items-center justify-center">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-4 h-4 rounded-full bg-blue-600 shadow-glow"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="pt-8 mt-auto shrink-0 w-full flex flex-col gap-4">
          {photos.length < photoCount ? (
            <button
              disabled={photos.length > 0 || countdown !== null}
              onClick={() => {
                if (stream) stream.getTracks().forEach(track => track.stop());
                router.push('/templates');
              }}
              className="w-full flex items-center justify-center gap-3 bg-surface-container-highest/50 py-4 rounded-full text-on-surface-variant hover:text-primary transition-all text-[10px] font-black uppercase tracking-[0.4em] border border-transparent hover:border-primary/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Switch Template
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 py-5 rounded-full text-white shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all font-black text-xs uppercase tracking-[0.6em] animate-in fade-in slide-in-from-bottom-2 duration-500 scale-100 hover:scale-[1.03] active:scale-95"
            >
              <CheckCircle2 size={18} />
              Selesai
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
