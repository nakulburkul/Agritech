import React, { useState, useEffect } from 'react';

// Perfectly mapped to your LandingPage components
const SECTIONS = [
  { id: 'hero', label: 'Welcome' },
  { id: 'brand', label: 'Market Trust' },
  { id: 'cultivating', label: 'Cultivation' },
  { id: 'features', label: 'Platform Features' },
  { id: 'innovation', label: 'AI Innovation' }
];

export function DotNavigation() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 } // Triggers when 40% of the section is visible
    );

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 hidden md:flex">
      {SECTIONS.map((section) => (
        <div key={section.id} className="relative group flex items-center justify-end">
          <span className="absolute right-8 px-2 py-1 bg-slate-800 text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {section.label}
          </span>
          
          <button
            onClick={() => scrollTo(section.id)}
            aria-label={`Scroll to ${section.label}`}
            className={`rounded-full transition-all duration-300 ${
              activeSection === section.id 
                ? 'w-3.5 h-3.5 bg-emerald-600 scale-110 shadow-[0_0_10px_rgba(5,150,105,0.4)]' 
                : 'w-2.5 h-2.5 bg-slate-300 hover:bg-emerald-400'
            }`}
          />
        </div>
      ))}
    </div>
  );
}