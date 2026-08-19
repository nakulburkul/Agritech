import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, Sun, Thermometer, Wind } from 'lucide-react';

const FloatingIcon = ({ icon, className, floatDelay = 0, appearDelay = 0 }: { icon: React.ReactNode, className?: string, floatDelay?: number, appearDelay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeOut", delay: appearDelay }}
    className={`absolute z-30 ${className}`}
  >
    <motion.div
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
      className="flex items-center justify-center w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50"
    >
      {icon}
    </motion.div>
  </motion.div>
);

export function InnovationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={containerRef} className="relative w-full bg-white overflow-hidden pt-12 md:pt-24 pb-48 min-h-[1000px] flex flex-col items-center">
      
      {/* Content Container */}
          <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-16 z-20 flex-1 flex flex-col justify-start">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-16 w-full shrink-0">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-[42px] md:text-[64px] lg:text-[84px] font-serif text-[#1c1f1a] leading-[0.95] tracking-[-0.04em] max-w-2xl mt-4 md:mt-0"
              >
                AI-Driven Agricultural <br/> Innovation
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="text-[13px] md:text-[14px] text-slate-500 leading-relaxed font-medium max-w-[320px] md:mt-4"
              >
                Explore expert tips, emerging technologies, and real-world success stories that drive smarter, more sustainable growth for modern farmers.
              </motion.p>
            </div>

            {/* Center Visuals */}
            <div className="relative w-full flex justify-center items-center mt-4 lg:mt-10 shrink-0">
              
              {/* Subtle Glow behind the image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none z-0" />

              {/* Main Central Image with Parallax Scale */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-20 w-[240px] h-[240px] md:w-[400px] md:h-[400px] lg:w-[440px] lg:h-[440px] rounded-[48px] rounded-tl-[16px] rounded-br-[16px] overflow-hidden shadow-[0_20px_60px_rgba(22,48,32,0.15)] bg-slate-100"
              >
                <motion.img 
                  style={{ scale: imageScale }}
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop" 
                  alt="Smart Agriculture Drone over Crops" 
                  className="w-full h-full object-cover"
                />
                {/* Inner Overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
              </motion.div>

              {/* Floating Icons positioned over the hill */}
              <div className="absolute inset-0 w-full h-full pointer-events-none flex justify-center items-center scale-90 md:scale-100">
                {/* Leftmost - Sparkles */}
                <FloatingIcon 
                  icon={<Sparkles className="w-5 h-5 text-emerald-500" />} 
                  className="hidden lg:flex -left-[2%] top-[50%]"
                  floatDelay={0}
                  appearDelay={0.4}
                />
                {/* Mid Left - Sun */}
                <FloatingIcon 
                  icon={<Sun className="w-5 h-5 text-yellow-500" />} 
                  className="left-[5%] md:left-[15%] top-[20%]"
                  floatDelay={1}
                  appearDelay={0.6}
                />
                {/* Mid Right - Thermometer */}
                <FloatingIcon 
                  icon={<Thermometer className="w-5 h-5 text-rose-400" />} 
                  className="right-[5%] md:right-[15%] top-[25%]"
                  floatDelay={0.5}
                  appearDelay={0.8}
                />
                {/* Rightmost - Wind */}
                <FloatingIcon 
                  icon={<Wind className="w-5 h-5 text-sky-400" />} 
                  className="hidden lg:flex -right-[2%] top-[55%]"
                  floatDelay={1.5}
                  appearDelay={1.0}
                />
              </div>
            </div>

          </div>

          {/* Background Hill Graphic (Scaled for viewport) */}
          <div className="absolute -bottom-[20%] md:-bottom-[30%] left-1/2 -translate-x-1/2 w-[250%] md:w-[150%] h-[300px] md:h-[600px] z-10 pointer-events-none">
            <div className="w-full h-full rounded-[100%] rounded-b-none bg-gradient-to-b from-[#e3f4c6] to-[#f3facb]" />
            
            {/* Bottom Text Inside Hill Removed */}
          </div>

    </section>
  );
}
