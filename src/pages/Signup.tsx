import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Lock, User as UserIcon, Mail, ArrowRight, AlertCircle, MapPin, Phone, ShieldCheck, FileText } from 'lucide-react';

export function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'customer' | 'farmer'>('customer');
  
  // Compulsory Basic Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Farmer Verification Fields
  const [govId, setGovId] = useState('');
  const [landRecord, setLandRecord] = useState('');
  const [consent, setConsent] = useState(false);

  // Optional Fields
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Extra validation for farmers
    if (role === 'farmer' && !consent) {
      setError('You must consent to the background verification to register as a farmer.');
      return;
    }

    setIsLoading(true);
    
    try {
      const payload = {
        username, email, password, role, location, phone,
        // Only send verification data if they are registering as a farmer
        ...(role === 'farmer' && { govId, landRecord })
      };

      const res = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        // If farmer, you could optionally route to a "Pending Verification" success page here
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed. Username may be taken.');
      }
    } catch (err) {
      setError('Server connection failed. Is Django running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24 pb-12">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-8">
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <Sprout className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-serif font-bold text-center text-slate-800 mb-2">Create an Account</h2>
        <p className="text-center text-slate-500 text-sm mb-8">Join the AgriTech marketplace today.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Role Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
          <button type="button" onClick={() => setRole('customer')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${role === 'customer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Buyer Account
          </button>
          <button type="button" onClick={() => setRole('farmer')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${role === 'farmer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Farmer Account
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          
          {/* Compulsory Basic Fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Account Details</h3>
            
            <div className="relative">
              <UserIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Username *" />
            </div>
            
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Email Address *" />
            </div>

            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Password *" />
            </div>
          </div>

          {/* Conditional Farmer Verification Block */}
          {role === 'farmer' && (
            <div className="space-y-4 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4" /> Identity Verification
              </h3>
              
              <div className="relative">
                <FileText className="w-5 h-5 text-emerald-600/50 absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="text" required={role === 'farmer'} value={landRecord} onChange={(e) => setLandRecord(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="7/12 Extract Number / Khatauni *" />
              </div>

              <div className="relative">
                <UserIcon className="w-5 h-5 text-emerald-600/50 absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="text" required={role === 'farmer'} value={govId} onChange={(e) => setGovId(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Aadhaar / PAN Number *" />
              </div>

              <label className="flex items-start gap-3 mt-4 cursor-pointer">
                <input type="checkbox" required={role === 'farmer'} checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500" />
                <span className="text-xs text-emerald-800 font-medium leading-relaxed">
                  I declare that the agricultural land records provided are authentic. I consent to AgriTech verifying these documents with local authorities.
                </span>
              </label>
            </div>
          )}

          {/* Optional Profile Fields */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Contact Details</h3>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="City / District" />
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Phone Number" />
              </div>
            </div>
          </div>

          <button disabled={isLoading} type="submit" className="w-full py-3.5 mt-2 bg-[#163020] text-white rounded-xl font-bold hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 disabled:opacity-70">
            {isLoading ? 'Processing...' : role === 'farmer' ? 'Submit for Verification' : 'Create Account'} <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account? <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}