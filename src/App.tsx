import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { CustomerPortal } from './pages/CustomerPortal';
import { FarmerPortal } from './pages/FarmerPortal';

import { ShopProvider } from './context/ShopContext';
import { SmoothScroll } from './components/SmoothScroll';

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/market" element={<PageWrapper><CustomerPortal /></PageWrapper>} />
        <Route path="/seller" element={<PageWrapper><FarmerPortal /></PageWrapper>} />
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
