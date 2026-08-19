import React, { useRef } from 'react';
import { CloudSun, Bell, MapPin, Zap, Sprout, TrendingUp, BarChart3 } from "lucide-react";
import { motion, useScroll, useTransform } from 'motion/react';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -250]);

  return (
    <div ref={heroRef} className="relative w-full flex flex-col pt-32 lg:pt-36 items-center justify-start bg-transparent z-20 pb-16">
      
      {/* Decorative Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Farmer */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-20 left-[5%] md:left-[10%] w-24 h-24 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden opacity-80"
        >
          <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" alt="Agriculture Field" />
        </motion.div>
        
        {/* Fruits / Oranges */}
        <motion.div 
          style={{ y: y3 }}
          className="absolute top-32 right-[5%] md:right-[12%] w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden opacity-80"
        >
          <img src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" alt="Fruits" />
        </motion.div>

        {/* Trees / Orchard */}
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-80 right-[2%] md:right-[8%] w-16 h-16 md:w-28 md:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden opacity-70"
        >
          <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" alt="Trees" />
        </motion.div>

        {/* Crops / Wheat */}
        <motion.div 
          style={{ y: y4 }}
          className="absolute top-96 left-[2%] md:left-[8%] w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden opacity-70"
        >
          <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" alt="Crops" />
        </motion.div>
      </div>

      {/* Hero Layout */}
      <div className="relative z-20 flex flex-col items-center justify-center px-6 lg:px-12 max-w-7xl mx-auto w-full mb-0 pt-0 pb-8">
        
        {/* Main Typography Area */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 z-20">
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[96px] font-serif text-[#163020] leading-[1.05] tracking-[-0.04em] mb-6"
          >
            Farming, <span className="italic text-emerald-700">Reimagined</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mb-8 leading-relaxed"
          >
            Empower your agricultural journey with AI-driven insights, live market predictions, and real-time weather analytics right in your pocket.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5">
              Get Started for Free
            </button>
            <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-full font-bold shadow-sm border border-slate-200 transition-all hover:-translate-y-0.5">
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Phone Mockup */}
        <div className="flex justify-center w-full z-30 -mb-12 md:-mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative z-30 w-[300px] sm:w-[320px] h-[550px] bg-slate-50 rounded-[48px] border-[12px] border-slate-900 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-slate-900 rounded-full z-50 flex items-center justify-between px-3">
           <div className="w-2 h-2 rounded-full bg-emerald-500" />
           <div className="w-2 h-2 rounded-full bg-blue-500/50" />
        </div>

        {/* Status Bar */}
        <div className="absolute top-4 left-6 right-6 flex justify-between z-40 text-white text-[10px] font-medium">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <Zap className="w-3 h-3 fill-current" />
          </div>
        </div>

        {/* App Header Image */}
        <div className="h-[42%] w-full relative bg-emerald-600 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1592982537447-6f2a6a0d6813?q=80&w=800&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-90" 
            alt="" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-black/20" />
          
          {/* User Info */}
          <div className="absolute top-14 left-5 right-5 flex justify-between items-center z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shadow-lg">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] text-emerald-100 font-medium">Location</p>
                <div className="flex items-center gap-1 text-white">
                  <MapPin className="w-3 h-3" />
                  <p className="text-sm font-bold tracking-tight">Maharashtra, IN</p>
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors">
              <Bell className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Floating Stat Cards (Overlapping header) */}
        <div className="relative z-20 -mt-8 px-4 flex gap-3">
          <div className="flex-1 bg-white p-3.5 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Market Trend</p>
              <p className="text-[13px] font-bold text-slate-800 text-emerald-600">+4.2% Up</p>
            </div>
          </div>
          <div className="flex-1 bg-white p-3.5 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Weather</p>
              <p className="text-[13px] font-bold text-slate-800">Sunny • 28°C</p>
            </div>
          </div>
        </div>

        {/* Quick Actions List */}
        <div className="px-5 mt-6 flex-1 bg-slate-50">
          <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">AI Insights</h4>
          
          <div className="bg-white p-3 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex justify-between items-center mb-3 cursor-pointer hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Crop Predictor</p>
                <p className="text-[10px] text-slate-500">Analyze weather & soil for best yield</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex justify-between items-center mb-5 cursor-pointer hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Live Market Prices</p>
                <p className="text-[10px] text-slate-500">Track current rates in nearby cities</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </div> {/* Close Phone Mockup Container */}
      </div> {/* Close Hero Layout */}

      {/* Foreground Grass/Hills overlapping Phone to blend into next section */}
      <div className="absolute bottom-0 left-0 w-full h-[150px] z-40 pointer-events-none overflow-hidden">
        {/* Stylized vector hills */}
        <div className="absolute bottom-[-30%] left-[-5%] w-[60%] h-[100%] bg-[#84a961] rounded-t-[100%] opacity-90" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[65%] h-[90%] bg-[#6a8b4e] rounded-t-[100%] opacity-90" />
      </div>

    </div>
  );
}
