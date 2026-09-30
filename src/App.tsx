import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { CustomerPortal } from './pages/CustomerPortal';
import { FarmerPortal } from './pages/FarmerPortal';
import { Login } from './pages/Login'; 
import { Signup } from './pages/Signup';

import { ShopProvider } from './context/ShopContext';
import { SmoothScroll } from './components/SmoothScroll';

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// Security Wrapper: Checks if user is logged in and has the right role
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Admins have master access to every route
  if (userRole === 'admin') return <>{children}</>;

  // Block customers from accessing restricted portals (like /seller)
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/market" replace />;
  }
  
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        
        {/* Protected Customer Route */}
        <Route path="/market" element={
          <ProtectedRoute>
            <PageWrapper><CustomerPortal /></PageWrapper>
          </ProtectedRoute>
        } />
        
        {/* Strictly Protected Farmer Route */}
        <Route path="/seller" element={
          <ProtectedRoute allowedRole="farmer">
            <PageWrapper><FarmerPortal /></PageWrapper>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <SmoothScroll>
        <Router>
          <div className="relative min-h-screen bg-white font-sans selection:bg-emerald-200 overflow-x-clip">
            <Navbar />
            <AnimatedRoutes />
            <Footer />
          </div>
        </Router>
      </SmoothScroll>
    </ShopProvider>
  );
}