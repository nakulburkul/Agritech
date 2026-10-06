import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Lock, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('username', data.username);
        // NEW: Save the user's registered location so it stops defaulting to Pune
        localStorage.setItem('userLocation', data.location || 'Pune');
        
        if (data.role === 'admin') {
          navigate('/'); 
        } else if (data.role === 'farmer') {
          navigate('/seller');
        } else {
          navigate('/market');
        }
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Server connection failed. Is Django running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <Sprout className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-serif font-bold text-center text-slate-800 mb-2">Welcome to AgriTech</h2>
        <p className="text-center text-slate-500 text-sm mb-8">Sign in to your account</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="Enter your username"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button disabled={isLoading} type="submit" className="w-full py-3.5 mt-4 bg-[#163020] text-white rounded-xl font-bold hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 disabled:opacity-70">
            {isLoading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-center text-sm text-slate-500 mt-4">
            Don't have an account? <Link to="/signup" className="font-bold text-emerald-600 hover:text-emerald-700">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}