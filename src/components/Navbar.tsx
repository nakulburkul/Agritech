import { Leaf, LogOut, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const NAV_LINKS = [
  { path: '/', label: 'Home', icon: Leaf },
  { path: '/market', label: 'Customer Market' },
  { path: '/seller', label: 'Farmer Portal' }
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

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
          if (link.path === '/seller' && userRole === 'customer') return null;

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

      {/* Enhanced Auth Section */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 pr-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
            {/* User Avatar (Initials) */}
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shadow-inner">
              {username.charAt(0).toUpperCase()}
            </div>
            
            {/* Name & Role */}
            <div className="hidden sm:flex flex-col pl-1 pr-2">
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">
                {userRole === 'admin' ? 'System Admin' : userRole === 'farmer' ? 'Verified Farmer' : 'Buyer'}
              </span>
              <span className="text-sm font-bold text-slate-800 leading-none">{username}</span>
            </div>

            <div className="w-[1px] h-6 bg-slate-200 hidden sm:block mx-1"></div>

            {/* Icon-only Logout Button */}
            <button 
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link 
            to="/login"
            className="px-6 py-2 bg-[#163020] text-white rounded-full text-sm font-bold hover:bg-emerald-900 transition-colors shadow-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}