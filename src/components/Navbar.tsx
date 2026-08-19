import { Leaf } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";

const NAV_LINKS = [
  { path: '/', label: 'Home', icon: Leaf },
  { path: '/market', label: 'Customer Market' },
  { path: '/seller', label: 'Farmer Portal' }
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="absolute top-0 left-0 right-0 w-full z-50 flex items-center justify-between py-6 px-8 max-w-7xl mx-auto">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src="https://res.cloudinary.com/ugpwhhlk/image/upload/f_auto,q_auto/Root-Photoroom" alt="AgriTech Logo" className="h-10 w-auto object-contain" />
        <span className="font-serif text-3xl tracking-tighter text-[#163020]">
          <span className="italic font-medium">Agri</span><span className="font-semibold text-[#1e422c]">Tech</span>
        </span>
      </Link>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-1 bg-white border border-slate-200 text-slate-600 rounded-full p-1.5 shadow-sm relative">
        {NAV_LINKS.map(link => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.path}
              to={link.path} 
              className={`relative flex items-center gap-1.5 px-5 py-1.5 rounded-full text-sm font-semibold transition-colors z-10 ${
                isActive ? 'text-white' : 'hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavbarTab"
                  className="absolute inset-0 bg-emerald-600 rounded-full shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {Icon && isActive && <Icon className="w-4 h-4" />}
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        <button className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">Sign In</button>
      </div>
    </nav>
  );
}
