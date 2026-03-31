"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, QrCode, CreditCard, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentPage() {
  const router = useRouter();
  const [method, setMethod] = useState('qris');

  // CLEAN UP OLD SESSION DATA WHEN ENTERING PAYMENT
  useEffect(() => {
    localStorage.removeItem('capturedPhotos');
    localStorage.removeItem('selectedTemplateId');
    localStorage.removeItem('sessionDeadline');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        router.push('/templates');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Summary & Methods */}
        <div className="md:col-span-5 flex flex-col gap-6">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
              <Zap className="fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-primary uppercase editorial-text">Electric Gallery</h1>
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Secure Checkout</p>
            </div>
          </div>

          {/* Order Summary Card */}
          <section className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-surface-variant/20">
            <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Order Summary</h2>
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-2xl font-extrabold tracking-tight editorial-text">Premium Booth</p>
                <p className="text-on-surface-variant text-sm italic">Unlimited High-Res Downloads</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-primary">$49.00</span>
              </div>
            </div>
            <div className="space-y-3 pt-6 border-t border-surface-variant/30">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Service Fee</span>
                <span className="font-medium">$2.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-primary/10">
                <span>Total Due</span>
                <span className="text-primary">$51.00</span>
              </div>
            </div>
          </section>

          {/* Payment Methods Selector */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-2">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMethod('qris')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all border-2 ${method === 'qris' ? 'bg-primary/5 border-primary shadow-md' : 'bg-surface-container-lowest border-transparent hover:bg-surface-container-high'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${method === 'qris' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                  <QrCode size={18} />
                </div>
                <span className={`text-xs font-bold ${method === 'qris' ? 'text-primary' : 'text-on-surface-variant'}`}>QRIS / E-Wallet</span>
              </button>
              <button
                onClick={() => setMethod('card')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all border-2 ${method === 'card' ? 'bg-primary/5 border-primary shadow-md' : 'bg-surface-container-lowest border-transparent hover:bg-surface-container-high'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${method === 'card' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                  <CreditCard size={18} />
                </div>
                <span className={`text-xs font-bold ${method === 'card' ? 'text-primary' : 'text-on-surface-variant'}`}>Credit Card</span>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: QR Code Display */}
        <div className="md:col-span-7 h-full">
          <div className="bg-surface-container-lowest rounded-lg p-10 flex flex-col items-center justify-center relative overflow-hidden h-full border border-surface-variant/20 shadow-xl">
            {/* Decorative element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 w-full flex flex-col items-center"
            >
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-black tracking-tighter mb-2 editorial-text">Scan to Pay</h2>
                <p className="text-on-surface-variant text-sm max-w-xs mx-auto">Open your favorite e-wallet app (GoPay, OVO, Dana) and scan the QR code below.</p>
              </div>

              {/* QR Code Container */}
              <div
                className="relative group p-6 bg-surface-container-lowest rounded-lg shadow-2xl border border-surface-variant/10 cursor-pointer"
                onClick={() => {
                  const deadline = Date.now() + (5 * 60 * 1000);
                  localStorage.setItem('sessionDeadline', deadline.toString());
                  router.push('/templates');
                }}
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>

                {/* QR Image */}
                <div className="bg-white p-4 rounded-md">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=https://electric-gallery.com"
                    alt="Payment QR"
                    className="w-64 h-64"
                  />
                </div>
                {/* Static indicator to simulate scanning */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-secondary/30 shadow-[0_0_15px_rgba(164,34,127,0.5)]"></div>
              </div>

              {/* Payment Status / Timer */}
              <div className="mt-10 flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full">
                  <Clock size={14} className="text-secondary" />
                  <span className="text-xs font-bold text-on-secondary-container tracking-widest uppercase">Expires in 14:59</span>
                </div>
                <div className="flex items-center gap-8 mt-4 grayscale opacity-40">
                  <span className="font-bold text-xl">GoPay</span>
                  <span className="font-bold text-xl">OVO</span>
                  <span className="font-bold text-xl">Dana</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer / Secondary Actions */}
          <div className="mt-8 flex justify-between items-center px-4">
            <div className="flex items-center gap-2 text-on-surface-variant/50">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">PCI-DSS Compliant</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
