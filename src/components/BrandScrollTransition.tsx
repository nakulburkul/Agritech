import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sprout, BrainCircuit, LineChart, CloudRain, ShieldCheck } from 'lucide-react';

export function BrandScrollTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // 1. Logo Animation (Assembles while scrolling into view)
  const logoScale = useTransform(scrollYProgress, [0.1, 0.33], [0.6, 1]);
  const logoOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const logoRotate = useTransform(scrollYProgress, [0.1, 0.33], [-15, 0]);

  // 2. Brand Name Smooth Animation
  const brandOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const brandY = useTransform(scrollYProgress, [0.15, 0.35], [40, 0]);
  const brandFilter = useTransform(scrollYProgress, [0.15, 0.35], ['blur(10px)', 'blur(0px)']);

  // 3. Tagline Animation
  const tagOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const tagY = useTransform(scrollYProgress, [0.2, 0.4], [30, 0]);

  // 4. Description Animation
  const descOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);
  const descY = useTransform(scrollYProgress, [0.25, 0.45], [30, 0]);

  // 5. Floating Feature Cards (Enter smoothly, then continuous subtle drift)
  const floatOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const float1Y = useTransform(scrollYProgress, [0.3, 0.8], [60, -60]);
  const float2Y = useTransform(scrollYProgress, [0.3, 0.8], [-60, 60]);
  const float3Y = useTransform(scrollYProgress, [0.3, 0.8], [80, -40]);
  const float4Y = useTransform(scrollYProgress, [0.3, 0.8], [-80, 40]);

  return (
    <div ref={containerRef} className="relative h-[200vh] w-full z-10 bg-white">
      {/* Sticky Full-Screen Canvas (Removed flex from wrapper to prevent inner h-full collapsing) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
        
        {/* Full White Background Screen with subtle ambient depth */}
        <div className="absolute inset-0 bg-white z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br from-emerald-100/40 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

        {/* Center Content Container */}
        <div className="relative z-10 w-full h-full max-w-[1440px] flex items-center justify-center mx-auto px-4">
          
          {/* Floating Feature 1: AI Analytics (Top Left) */}
          <motion.div
            style={{ opacity: floatOpacity, y: float1Y }}
            className="hidden lg:flex absolute top-[24%] left-[6%] xl:left-[10%] bg-white p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-emerald-50 items-center gap-4 z-20 pointer-events-auto"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-sm">AI Analytics</p>
              <p className="text-xs text-slate-500">Smart crop tracking</p>
            </div>
          </motion.div>

          {/* Floating Feature 2: Market Data (Bottom Right) */}
          <motion.div
            style={{ opacity: floatOpacity, y: float2Y }}
            className="hidden lg:flex absolute bottom-[16%] right-[6%] xl:right-[10%] bg-white p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-blue-50 items-center gap-4 z-20 pointer-events-auto"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <LineChart className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-sm">Live Markets</p>
              <p className="text-xs text-slate-500">Real-time pricing data</p>
            </div>
          </motion.div>

          {/* Floating Feature 3: Precision Weather (Bottom Left) */}
          <motion.div
            style={{ opacity: floatOpacity, y: float3Y }}
            className="hidden lg:flex absolute bottom-[18%] left-[8%] xl:left-[12%] bg-white p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-orange-50 items-center gap-4 z-20 pointer-events-auto"
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
              <CloudRain className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-sm">Precision Weather</p>
              <p className="text-xs text-slate-500">Hyper-local forecasts</p>
            </div>
          </motion.div>

          {/* Floating Feature 4: Secure Platform (Top Right) */}
          <motion.div
            style={{ opacity: floatOpacity, y: float4Y }}
            className="hidden lg:flex absolute top-[26%] right-[8%] xl:right-[12%] bg-white p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-indigo-50 items-center gap-4 z-20 pointer-events-auto"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-sm">Secure Platform</p>
              <p className="text-xs text-slate-500">Verified buyers & sellers</p>
            </div>
          </motion.div>

          {/* Central Content Block (Perfectly centered vertically and horizontally) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 px-6 text-center md:text-left z-30">
            {/* Pop-up Logo */}
            <motion.div
              style={{
                scale: logoScale,
                opacity: logoOpacity,
                rotate: logoRotate,
              }}
              className="relative flex items-center justify-center shrink-0 z-30 pointer-events-auto"
            >
              {/* Soft Ambient Glow */}
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-3xl scale-125" />
              
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full bg-white p-4 shadow-[0_20px_50px_rgba(22,48,32,0.12)] border border-emerald-100 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/ugpwhhlk/image/upload/f_auto,q_auto/Root-Photoroom"
                  alt="AgriTech Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>

            {/* Brand Name & Tagline */}
            <div className="flex flex-col items-center md:items-start z-30 pointer-events-auto">
              <motion.div
                style={{
                  opacity: brandOpacity,
                  y: brandY,
                  filter: brandFilter,
                }}
                className="flex items-center gap-1 font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[100px] tracking-tighter text-[#163020] leading-none"
              >
                <span className="italic font-medium">Agri</span>
                <span className="font-semibold text-[#1e422c]">Tech</span>
              </motion.div>

              {/* Smooth Animated Tagline */}
              <motion.div
                style={{
                  opacity: tagOpacity,
                  y: tagY,
                }}
                className="mt-3 md:mt-5 flex items-center gap-2 text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-4 md:px-5 py-1.5 md:py-2 rounded-full"
              >
                <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nurturing Tomorrow's Agriculture</span>
              </motion.div>

              {/* Description Text */}
              <motion.p
                style={{
                  opacity: descOpacity,
                  y: descY,
                }}
                className="mt-4 md:mt-6 text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed max-w-md lg:max-w-lg font-medium"
              >
                Empowering the future of agriculture through advanced AI analytics, direct market connections, and precision weather tracking. Join the revolution in smart farming.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
