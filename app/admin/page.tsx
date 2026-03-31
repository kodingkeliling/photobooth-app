"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, BarChart3, LayoutGrid, Settings, Plus, DollarSign, 
  Trash2, Edit3, Image as ImageIcon, LogOut, ChevronRight,
  TrendingUp, TrendingDown, Clock, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const stats = [
  { name: 'Total Revenue', value: '$12,450', change: '+12.5%', type: 'up', icon: DollarSign },
  { name: 'Total Sessions', value: '458', change: '+8.2%', type: 'up', icon: Users },
  { name: 'Average Rating', value: '4.8', change: '-2.1%', type: 'down', icon: BarChart3 },
];

const mockTemplates = [
  { id: 1, name: 'Editorial Classic', sessions: 124, status: 'Active', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Neon Dreams', sessions: 98, status: 'Active', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Vintage Film', sessions: 76, status: 'Inactive', image: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&q=80&w=400' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex">
      {/* Sidebar */}
      <aside className={`bg-on-surface text-surface h-screen sticky top-0 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-20 flex items-center justify-center border-b border-surface/10 p-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
            <LayoutGrid size={24} />
          </div>
          {isSidebarOpen && <span className="ml-3 text-lg font-bold editorial-text tracking-tighter">ELECTRIC ADMIN</span>}
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          {[
            { id: 'overview', icon: BarChart3, label: 'Overview' },
            { id: 'templates', icon: LayoutGrid, label: 'Templates' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-surface-variant hover:bg-surface/10 hover:text-surface'}`}
            >
               <item.icon size={20} />
               {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-surface/10">
           <button 
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
           >
              <LogOut size={20} />
              {isSidebarOpen && <span className="font-medium text-sm">Exit Admin</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl editorial-text font-black tracking-tighter">
              {activeTab === 'overview' ? 'Dashboard Overview' : 'Manage Templates'}
            </h1>
            <p className="text-on-surface-variant font-medium">Monday, 28 March 2026</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-surface-container-low border border-surface-variant/20 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {activeTab === 'templates' && (
              <button className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-primary-dim shadow-xl shadow-primary/10">
                <Plus size={20} />
                Add New
              </button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div 
               key="overview"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-10"
            >
               {/* Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-surface-container-lowest p-8 rounded-3xl shadow-xl border border-surface-variant/20 group hover:border-primary/50 transition-colors">
                       <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                             <stat.icon size={22} />
                          </div>
                          <div className={`flex items-center gap-1 text-sm font-bold ${stat.type === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                             {stat.type === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                             {stat.change}
                          </div>
                       </div>
                       <div className="text-3xl font-black editorial-text mb-1">{stat.value}</div>
                       <div className="text-on-surface-variant text-sm font-medium uppercase tracking-widest">{stat.name}</div>
                    </div>
                  ))}
               </div>

               {/* Recent Sessions List */}
               <div className="bg-surface-container-lowest rounded-3xl shadow-xl border border-surface-variant/20 overflow-hidden">
                  <div className="p-8 border-b border-surface-variant/20 flex justify-between items-center">
                     <h2 className="text-xl font-bold editorial-text">Recent Sessions</h2>
                     <button className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                        View All <ChevronRight size={16} />
                     </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="border-b border-surface-variant/10 text-on-surface-variant/40 text-[10px] uppercase font-bold tracking-[0.2em]">
                             <th className="px-8 py-4">User</th>
                             <th className="px-8 py-4">Template</th>
                             <th className="px-8 py-4">Status</th>
                             <th className="px-8 py-4">Revenue</th>
                             <th className="px-8 py-4">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-surface-variant/5">
                          {[1, 2, 3, 4].map((i) => (
                            <tr key={i} className="hover:bg-surface/50 transition-colors group">
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold">User #{4281 + i}</p>
                                        <p className="text-[10px] text-on-surface-variant font-medium">12:0{i} PM</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-5 text-sm font-medium">Editorial Classic</td>
                               <td className="px-8 py-5">
                                  <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-widest">Completed</span>
                               </td>
                               <td className="px-8 py-5 text-sm font-black">$49.00</td>
                               <td className="px-8 py-5">
                                  <button className="text-on-surface-variant/40 hover:text-primary transition-colors">
                                     <Edit3 size={18} />
                                  </button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
            </motion.div>
          ) : (
            <motion.div 
               key="templates"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
               {mockTemplates.map((template) => (
                  <div key={template.id} className="bg-surface-container-lowest rounded-3xl shadow-xl border border-surface-variant/20 overflow-hidden group">
                     <div className="aspect-video relative overflow-hidden bg-slate-100">
                        <img src={template.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                        <div className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                           <button className="hover:text-primary transition-colors"><Edit3 size={16} /></button>
                           <button className="hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                        </div>
                     </div>
                     <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <h3 className="text-lg font-bold editorial-text">{template.name}</h3>
                           <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${template.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                              {template.status}
                           </span>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                              <ImageIcon size={14} className="text-primary" />
                              {template.sessions} sessions
                           </div>
                           <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                              <Clock size={14} className="text-secondary" />
                              Updated 2d ago
                           </div>
                        </div>
                     </div>
                  </div>
               ))}

               {/* Add Template Placeholder */}
               <button className="bg-surface/30 border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center p-12 min-h-[300px] hover:border-primary/50 hover:bg-primary/5 transition-all text-primary group">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Plus size={32} />
                  </div>
                  <span className="font-bold text-sm uppercase tracking-widest">Add New Template</span>
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
