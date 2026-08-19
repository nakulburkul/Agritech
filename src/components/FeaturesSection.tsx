import React from 'react';
import { motion } from 'motion/react';

const FeatureCard = ({ title, desc, color = "bg-white", className, arrowDelay = 0, cardDelay = 0 }: { title: React.ReactNode, desc: string, color?: string, className?: string, arrowDelay?: number, cardDelay?: number }) => (
  <div className={`group relative w-full h-[320px] md:h-[380px] ${className}`}>
    
    {/* Arrow (Appears First) */}
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: arrowDelay }}
      className="hidden md:block absolute bottom-4 -right-12 text-slate-800 transition-transform duration-500 group-hover:translate-x-2 z-0"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M4 12h16M14 6l6 6-6 6" />
      </svg>
    </motion.div>

    {/* Sticker/Card (Appears After) */}
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: cardDelay }}
      className={`w-full h-full p-8 md:p-10 flex flex-col justify-between ${color} shadow-xl transition-transform duration-500 md:group-hover:-translate-y-2 cursor-pointer relative z-10`}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4rem), calc(100% - 4rem) 100%, 0 100%)" }}
    >
      <h3 className="text-3xl md:text-[36px] font-medium text-slate-900 leading-[1.05] tracking-tight">{title}</h3>
      <p className="text-[13px] md:text-[14px] text-slate-700 leading-relaxed font-medium mb-4">{desc}</p>
    </motion.div>
    
  </div>
);

export function FeaturesSection() {
  return (
    <section className="relative w-full bg-[#d2d1c3] overflow-hidden p-6 md:p-12 min-h-[900px] flex flex-col">
      {/* Faint Background Logo/Watermark */}
          <div className="absolute inset-0 opacity-[0.08] flex items-center justify-center pointer-events-none mt-20">
            <svg viewBox="0 0 48 24" className="w-[200%] md:w-[1100px] h-auto" fill="none" strokeWidth="1.5">
              <path d="M 24 12 C 14 -2 2 -2 2 12 C 2 26 14 26 24 12" stroke="#000" />
              <path d="M 24 12 C 34 26 46 26 46 12 C 46 -2 34 -2 24 12" stroke="#000" />
            </svg>
          </div>

          <div className="relative w-full max-w-[1400px] mx-auto flex flex-col">
            {/* Top Typography */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full mb-16 md:mb-24 z-20">
              <div className="relative">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[52px] md:text-[84px] lg:text-[96px] font-serif text-[#20201d] leading-[0.95] tracking-[-0.04em] font-medium"
          >
            Farming Smarter <br/> Living Better
          </motion.h2>
              </div>
              <div className="max-w-[300px] lg:max-w-[340px] mt-6 md:mt-0 relative z-20">
                <motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-[13px] lg:text-[15px] text-[#5c5c56] leading-[1.8] font-medium"
          >
            Transforming agriculture with smart solutions that boost productivity, support farmers, and strengthen communities.
                </motion.p>
              </div>
            </div>

            {/* Cards Container */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 w-full z-20 items-center">
              
              {/* Smart Weather Insights */}
              <FeatureCard
                title={<>Smart<br/>Weather<br/>Insights</>}
                desc="Stay ahead with real-time weather updates tailored to your needs"
                color="bg-white"
                className="md:-translate-y-8"
                arrowDelay={0.1}
                cardDelay={0.5}
              />

              {/* Sustainable farming */}
              <FeatureCard
                title={<>Sustainable<br/>farming real<br/>result</>}
                desc="Stay ahead of every forecast with real-time weather data that helps you plan, protect, boost"
                color="bg-[#edfc35]"
                className="md:translate-y-12"
                arrowDelay={0.6}
                cardDelay={1.0}
              />

              {/* Dynamic Crop Tracking */}
              <FeatureCard
                title={<>Dynamic<br/>Crop<br/>Tracking</>}
                desc="Monitor your crops in real time with smart insights that track growth, health, and yield — all in one place"
                color="bg-white"
                className="md:-translate-y-4"
                arrowDelay={1.1}
                cardDelay={1.5}
              />

            </div>
          </div>
    </section>
  );
}
