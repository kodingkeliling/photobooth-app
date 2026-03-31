"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, Sparkles, Palette, Users, Share } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-surface/80 backdrop-blur-md">
        <div className="text-2xl font-extrabold text-primary tracking-tighter editorial-text">
          Electric Gallery
        </div>
        <div className="hidden md:flex items-center space-x-8 font-bold tracking-tight">
          <Link className="text-primary border-b-2 border-primary pb-1 hover:text-primary transition-colors" href="#">Gallery</Link>
          <Link className="text-on-surface-variant font-medium hover:text-primary transition-colors" href="#">Pricing</Link>
          <Link className="text-on-surface-variant font-medium hover:text-primary transition-colors" href="#">About</Link>
        </div>
        <button 
          onClick={() => router.push('/payment')}
          className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold scale-95 active:scale-90 transition-transform shadow-lg shadow-primary/10"
        >
          Launch Booth
        </button>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center px-8 md:px-16 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto z-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-6xl md:text-8xl editorial-text font-extrabold text-on-surface leading-none">
                Capture <br/>
                <span className="text-primary italic">Electric</span> <br/>
                Moments.
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant max-w-lg leading-relaxed">
                Step into a fluid, high-energy space where your photos become professional editorial masterpieces in seconds.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => router.push('/payment')}
                  className="bg-primary text-on-primary text-lg font-bold px-10 py-5 rounded-full hover:bg-primary-dim transition-all shadow-xl shadow-primary/20"
                >
                  Start Your Booth
                </button>
                <button className="bg-surface-container-highest text-primary font-bold px-10 py-5 rounded-full hover:bg-surface-variant transition-all">
                  View Showcase
                </button>
              </div>
            </motion.div>

            {/* Hero Asymmetric Image Stack */}
            <div className="relative h-[600px] w-full hidden md:block">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 3 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute top-10 right-0 w-3/4 h-4/5 rounded-lg overflow-hidden shadow-2xl bg-surface-container-highest"
              >
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800" 
                  alt="Photography"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: -6 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute bottom-0 left-0 w-2/3 h-3/4 rounded-lg overflow-hidden shadow-2xl bg-surface-container-low border-8 border-surface-container-lowest"
              >
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&q=80&w=800" 
                  alt="Camera lens"
                />
              </motion.div>
            </div>
          </div>
          {/* Background Decorative Blobs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <h2 className="text-4xl md:text-5xl editorial-text font-bold text-on-surface max-w-xl">
                Designed for the <span className="text-secondary">Extraordinary</span> Studio Experience.
              </h2>
              <p className="text-on-surface-variant max-w-xs font-medium">
                Elevating every snapshot into a curated memory using tonal depth and editorial authority.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
              <div className="md:col-span-7 bg-surface-container-lowest rounded-lg p-10 flex flex-col justify-between group overflow-hidden relative">
                <div className="z-10">
                  <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">AI Enhanced</span>
                  <h3 className="text-3xl editorial-text font-bold mb-4">Editorial Polish</h3>
                  <p className="text-on-surface-variant max-w-sm">Every photo is automatically processed with professional-grade color grading and lighting adjustments.</p>
                </div>
                <div className="absolute right-0 bottom-0 w-1/2 h-1/2 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-48 h-48 text-primary" />
                </div>
              </div>

              <div className="md:col-span-5 bg-primary rounded-lg p-10 flex flex-col justify-center items-center text-center text-on-primary">
                <Zap className="w-16 h-16 mb-6" />
                <h3 className="text-3xl editorial-text font-bold mb-4">Instant Delivery</h3>
                <p className="opacity-90">QR-code access ensures your gallery is live on your device before you even leave the booth.</p>
              </div>

              <div className="md:col-span-4 bg-secondary-container rounded-lg p-8 flex flex-col justify-between border border-secondary/10">
                <Palette className="w-8 h-8 text-on-secondary-container" />
                <h4 className="text-xl editorial-text font-bold text-on-secondary-container">Custom Filters</h4>
              </div>
              <div className="md:col-span-4 bg-surface-container-highest rounded-lg p-8 flex flex-col justify-between">
                <Users className="w-8 h-8 text-primary" />
                <h4 className="text-xl editorial-text font-bold text-on-surface">Group Sync</h4>
              </div>
              <div className="md:col-span-4 bg-surface-container-lowest rounded-lg p-8 flex flex-col justify-between border-2 border-primary/5">
                <Share className="w-8 h-8 text-secondary" />
                <h4 className="text-xl editorial-text font-bold text-on-surface">Social Ready</h4>
              </div>
            </div>
          </div>
        </section>

        {/* Signature Component: The Photo Strip */}
        <section className="py-24 px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
            <div className="w-full md:w-1/3 order-2 md:order-1">
              <div className="bg-surface-container-lowest rounded-lg p-4 shadow-2xl rotate-[-2deg] flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[3/4] rounded-md overflow-hidden bg-slate-100">
                    <img 
                      className="w-full h-full object-cover" 
                      src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=400`} 
                      alt={`Photo ${i}`}
                    />
                  </div>
                ))}
                <div className="py-2 flex justify-center opacity-30">
                  <div className="w-12 h-1 bg-on-surface rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3 order-1 md:order-2 space-y-8">
              <h2 className="text-5xl md:text-7xl editorial-text font-extrabold leading-tight">
                The Signature <br/> <span className="text-primary">Strip Card.</span>
              </h2>
              <p className="text-xl text-on-surface-variant leading-relaxed max-w-xl">
                A custom component for the digital age. A vertical stack using tonal layering and refined spacing to mimic the physical nostalgic joy of a traditional photo booth.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-surface bg-primary/20 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" />
                    </div>
                  ))}
                </div>
                <span className="font-bold text-on-surface">Joined by 10k+ creators</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8">
          <div className="max-w-7xl mx-auto rounded-lg bg-on-surface p-12 md:p-24 relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[120px]"></div>
            </div>
            <h2 className="text-4xl md:text-6xl editorial-text font-bold text-surface mb-8 z-10">Ready to break the grid?</h2>
            <p className="text-surface-variant text-xl mb-12 max-w-2xl z-10">Join the movement and start your first booth session today. No equipment needed, just your energy.</p>
            <button 
              onClick={() => router.push('/payment')}
              className="bg-primary text-on-primary text-xl font-bold px-12 py-6 rounded-full hover:bg-primary-dim transition-all z-10 scale-100 hover:scale-105 shadow-2xl shadow-primary/40"
            >
              Launch Your First Booth
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center bg-surface border-t border-surface-variant">
        <div className="mb-8 md:mb-0">
          <div className="text-lg font-bold text-on-surface mb-2">Electric Gallery</div>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">© 2024 Electric Gallery. All rights reserved.</p>
        </div>
        <div className="flex gap-8 text-xs uppercase tracking-widest text-on-surface-variant">
          <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
          <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
          <Link className="hover:text-primary transition-colors" href="#">Support</Link>
        </div>
      </footer>
    </div>
  );
}
