"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';

interface SessionTimerProps {
  onExpire?: () => void;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({ 
  onExpire
}) => {
  const router = useRouter();
  
  const [timeLeft, setTimeLeft] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const deadline = localStorage.getItem('sessionDeadline');
      if (deadline) {
        return Math.max(0, Math.floor((parseInt(deadline) - Date.now()) / 1000));
      }
    }
    return null;
  });

  useEffect(() => {
    let deadline = localStorage.getItem('sessionDeadline');
    if (!deadline) {
      const newDeadline = Date.now() + (5 * 60 * 1000);
      localStorage.setItem('sessionDeadline', newDeadline.toString());
      deadline = newDeadline.toString();
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, parseInt(deadline!) - Date.now());
      const seconds = Math.floor(remaining / 1000);
      setTimeLeft(seconds);

      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) {
          onExpire();
        } else {
          router.push('/results');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [router, onExpire]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-4 right-6 z-[100] flex items-center gap-2.5 bg-white/80 backdrop-blur-3xl px-3.5 py-1.5 rounded-xl border border-blue-100/50 shadow-[0_10px_30px_rgba(37,99,235,0.08)] transition-all">
      <div className="flex flex-col justify-center">
        <span className="text-[5.5px] font-black uppercase tracking-[0.2em] leading-none mb-0.5 text-right text-blue-600/50">
          Closes In
        </span>
        <span className="text-sm font-black italic tracking-tighter tabular-nums leading-none editorial-text text-blue-600">
          {timeLeft !== null ? formatTime(timeLeft) : "5:00"}
        </span>
      </div>

      <div className="relative w-5 h-5 flex items-center justify-center">
        <Clock size={10} className="text-blue-600 opacity-80 animate-pulse" />
        <svg className="absolute inset-0 -rotate-90 w-full h-full">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1"
            className="text-blue-600/10"
          />
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-blue-600"
            strokeDasharray="50.2"
            strokeDashoffset={timeLeft !== null ? 50.2 - (50.2 * (timeLeft / 300)) : 0}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
      </div>
    </div>
  );
};
