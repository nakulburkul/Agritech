import React, { useRef } from 'react';
import { ArrowDown, Play, Flower, Tractor } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

export function CultivatingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  
  // Progress for the overall section background/parallax
  const { scrollYProgress: sectionProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Progress specifically for the text reveal (starts later, ends later for a slower wipe)
  const { scrollYProgress: textProgress } = useScroll({
    target: textRef,
    offset: ["start 90%", "end 30%"]
  });

  const imageY = useTransform(sectionProgress, [0, 1], [-50, 50]);
  const contentY = useTransform(sectionProgress, [0.2, 0.8], [50, 0]);

  // Typewriter wipe effects (left to right) with slight opacity fade-in
  const clipStart = 'inset(-20% 100% -20% -20%)';
  const clipEnd = 'inset(-20% -20% -20% -20%)';

  const line1Clip = useTransform(textProgress, [0, 0.35], [clipStart, clipEnd]);
  const line2Clip = useTransform(textProgress, [0.3, 0.65], [clipStart, clipEnd]);
  const line3Clip = useTransform(textProgress, [0.6, 0.95], [clipStart, clipEnd]);

  const line1Opacity = useTransform(textProgress, [0, 0.15], [0, 1]);
  const line2Opacity = useTransform(textProgress, [0.3, 0.45], [0, 1]);
  const line3Opacity = useTransform(textProgress, [0.6, 0.75], [0, 1]);

  return (
    <section ref={containerRef} className="relative w-full bg-white overflow-hidden pb-16 z-10">
      
      {/* Top curved mask with image */}
      {/* Container slightly wider than viewport to create smooth curve */}
      <div className="relative w-[150%] left-1/2 -translate-x-1/2 h-[180px] md:h-[220px] overflow-hidden rounded-b-[50%]">
        <motion.img 
          style={{ y: imageY, scale: 1.1 }}
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop" 
          alt="Farm landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
      </div>

      {/* Yellow Button bridging the gap (Floating) */}
      <motion.div 
        className="absolute left-1/2 -translate-x-1/2 top-[140px] md:top-[180px] z-10"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <button className="w-16 h-16 md:w-20 md:h-20 bg-[#fbff00] hover:bg-yellow-400 text-slate-900 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 group">
          <ArrowDown className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:translate-y-1" />
        </button>
      </motion.div>

      {/* Main Content Area */}
      <motion.div 
        style={{ y: contentY }}
        className="relative z-20 mt-10 md:mt-16 flex flex-col items-center px-4"
      >
        
        {/* Play Button Overlay (Diamond shape mimicking a play button - gently floating) */}
        <motion.button 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="w-24 h-24 md:w-32 md:h-32 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-[32px] rotate-45 flex items-center justify-center hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all mb-8 relative group"
        >
          <div className="-rotate-45 ml-2 transition-transform group-hover:scale-110">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-emerald-500 fill-emerald-500" />
          </div>
        </motion.button>

        <span className="border border-emerald-200 text-emerald-600 bg-emerald-50 px-5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-10 shadow-sm">
          Know about us
        </span>

        {/* Typography with Typewriter Wipe Reveal */}
        <h2 ref={textRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-[72px] font-serif leading-[1.1] text-center max-w-5xl mx-auto flex flex-col items-center gap-2 md:gap-5">
          
          <motion.div 
            style={{ clipPath: line1Clip, opacity: line1Opacity }}
            className="flex items-center flex-wrap justify-center gap-3 md:gap-5 text-[#163020]"
          >
            <span className="italic text-[#286b51] tracking-tighter">Cultivating Tomorrow</span>
            <span className="inline-flex items-center justify-center bg-blue-100/50 text-blue-600 rounded-full w-10 h-10 md:w-16 md:h-16 shadow-sm border border-blue-200 shrink-0">
              <Flower className="w-5 h-5 md:w-8 md:h-8" />
            </span>
            <span className="tracking-tighter">Where</span>
          </motion.div>
          
          <motion.div 
            style={{ clipPath: line2Clip, opacity: line2Opacity }}
            className="text-[#163020] tracking-tighter"
          >
            AI Nurtures A Greener, Smarter
          </motion.div>
          
          <motion.div 
            style={{ clipPath: line3Clip, opacity: line3Opacity }}
            className="flex items-center flex-wrap justify-center gap-3 md:gap-5 text-[#163020]"
          >
            <span className="italic tracking-tighter">Future In Agriculture</span>
            <span className="inline-flex items-center justify-center bg-emerald-100/50 text-emerald-600 rounded-full w-10 h-10 md:w-16 md:h-16 shadow-sm border border-emerald-200 shrink-0">
              <Tractor className="w-5 h-5 md:w-8 md:h-8" />
            </span>
          </motion.div>
          
        </h2>
      </motion.div>
    </section>
  );
}
