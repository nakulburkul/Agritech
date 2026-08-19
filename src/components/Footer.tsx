import React from 'react';
import { ArrowRight } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    Company: [
      'Our Product',
      'Home',
      'Production',
      'Testimonial',
      'Careers',
      'Cookie Policy',
    ],
    Support: [
      'Help Center',
      'Contact Us',
      'AI System',
      'Farmer Support',
      'Ask an Expert',
      'Troubleshooting',
    ],
    Learn: [
      'Explore',
      'Newsletter',
      'Farming 101',
      'Tips & Tutorials',
      'Industry Reports',
      'Smart Farming',
    ],
    Individuals: [
      'Start Farming',
      'Track Crops',
      'Mobile App',
      'Soil Test',
      'Rewards',
      'Management',
    ],
  };

  return (
    <footer className="relative bg-white pt-20 pb-16 overflow-hidden z-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Giant Typography Header */}
        <div className="w-full flex justify-center mb-16 md:mb-24">
          <h1 className="text-[18vw] lg:text-[200px] xl:text-[240px] font-serif text-[#163020] leading-none tracking-[-0.04em] select-none">
            <span className="italic font-medium">Agri</span><span className="font-semibold text-[#1e422c]">Tech</span>
          </h1>
        </div>

        {/* Bottom Area: Book a Call & Links Grid */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8 mt-12 border-t border-slate-100 pt-12">
          
          {/* Left: Book a Call */}
          <div className="flex flex-col items-start lg:w-1/3">
            <h3 className="text-3xl md:text-4xl font-serif text-slate-800 mb-6 tracking-tight">
              Book a Call
            </h3>
            <button className="w-16 h-16 md:w-20 md:h-20 bg-[#fbff00] hover:bg-yellow-400 text-slate-900 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105">
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          {/* Right: Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 lg:w-2/3 w-full">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="flex flex-col">
                <h4 className="text-xs font-bold text-slate-900 mb-6">{category}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-[13px] text-slate-500 hover:text-emerald-600 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
