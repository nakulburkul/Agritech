import React, { useState, useEffect } from 'react';
import { Package, IndianRupee, Sprout, TrendingUp, Plus, Activity, LayoutDashboard, Settings, User, X, Handshake, CheckCircle2, XCircle, Truck, MapPin, Bell, BarChart2, CloudSun, ChevronRight, Loader2, Sun, Droplets, ThermometerSun, AlertTriangle, RefreshCw, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop, Product, Offer } from '../context/ShopContext';
import { fetchMarketPrices, CommodityData, MAHARASHTRA_DISTRICTS } from '../services/marketApi';

export function FarmerPortal() {
  const { products, offers, addProduct, updateOfferStatus } = useShop();
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // District & GPS State
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [userLocation, setUserLocation] = useState('Pune, Maharashtra');
  const [userCoordinates, setUserCoordinates] = useState<{lat: number, lng: number} | null>(null);
  
  // AI Predictor State
  const [analytics, setAnalytics] = useState<any>(null);
  const [prediction, setPrediction] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [soilType, setSoilType] = useState('Black Cotton');
  const [hasIrrigation, setHasIrrigation] = useState(false);
  
  // Mandi Data & Market Dropdown Selection Memory
  const [localMandiPrices, setLocalMandiPrices] = useState<CommodityData[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<Record<string, number>>({});
  const [isLoadingMandi, setIsLoadingMandi] = useState(false);

  const CURRENT_FARMER_ID = 'FRM-1044';
  const myOffers = offers.filter(o => o.farmerId === CURRENT_FARMER_ID);
  const pendingOffersCount = myOffers.filter(o => o.status === 'Pending').length;
  
  // Add Crop Modal Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [location, setLocation] = useState('Pune, MH');

  // Trigger GPS detection on mount
  useEffect(() => {
    handleUseGPS();
  }, []);

  // Fetch district mandi prices when selected district changes
  useEffect(() => {
    if (selectedDistrict) {
      loadMandiPrices(selectedDistrict);
    }
  }, [selectedDistrict]);

  const loadMandiPrices = async (district: string) => {
    setIsLoadingMandi(true);
    const data = await fetchMarketPrices(district);
    setLocalMandiPrices(data);
    
    // Set each card to default to its first mandi
    const initialMap: Record<string, number> = {};
    data.forEach(item => { initialMap[item.id] = 0; });
    setSelectedMarkets(initialMap);
    
    setIsLoadingMandi(false);
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) return;
    setLocationStatus('Locating device via GPS...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const data = await res.json();
          const detected = (data.address.state_district || data.address.city || data.address.town || 'Pune').replace(' District', '');
          const match = MAHARASHTRA_DISTRICTS.find(d => d.toLowerCase() === detected.toLowerCase()) || detected;
          
          setSelectedDistrict(match);
          setUserLocation(data.address.suburb && data.address.city ? `${data.address.city}, ${data.address.suburb}` : `${match}, Maharashtra`);
          setUserCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          
          setPredictions([]);
          setPrediction('');
          setAnalytics(null);
          setLocationStatus('');
        } catch (err) {
          console.error('GPS Geocoding failed', err);
          setLocationStatus('');
        }
      },
      () => setLocationStatus('')
    );
  };

  const handleSmartPredict = async () => {
    if (!selectedDistrict) return;
    setIsPredicting(true);
    setLocationStatus(`Forecasting climate & soil capabilities for ${selectedDistrict}...`);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/smart-predict/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location_name: selectedDistrict,
          lat: userCoordinates?.lat,
          lon: userCoordinates?.lng,
          soil: soilType,
          irrigation: hasIrrigation
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setAnalytics(data.analytics);
        if (data.predictions && data.predictions.length > 0) {
          setPredictions(data.predictions);
          setPrediction(data.predictions[0].crop);
        } else {
          setPrediction(data.prediction || 'Wheat');
        }
      }
    } catch (err) {
      console.error('Prediction failed', err);
    }
    setIsPredicting(false);
    setLocationStatus('');
  };

  const handleResetAnalysis = () => {
    setPrediction('');
    setPredictions([]);
    setAnalytics(null);
  };

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    let defaultImage = '';
    if (category === 'Vegetables') defaultImage = 'https://images.unsplash.com/photo-1595856728564-9842514110b6?q=80&w=400&auto=format&fit=crop';
    else if (category === 'Fruits') defaultImage = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400&auto=format&fit=crop';
    else defaultImage = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80';

    addProduct({
      name, price: parseFloat(price), stock: parseInt(stock, 10),
      category, status: 'Active', image: defaultImage, location: location
    });

    setIsAddingCrop(false);
    setName(''); setPrice(''); setStock('');
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 flex flex-col md:flex-row pb-16">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 px-6 py-8 hidden md:block shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-bold text-slate-800">Farmer {CURRENT_FARMER_ID}</p>
            <p className="text-xs text-emerald-600 font-semibold">Verified Seller</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><LayoutDashboard className="w-5 h-5" /> Dashboard</button>
          <button onClick={() => setActiveTab('offers')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'offers' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
            <div className="flex items-center gap-3"><Handshake className="w-5 h-5" /> Offers</div>
            {pendingOffersCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingOffersCount}</span>}
          </button>
          <button onClick={() => setActiveTab('crops')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'crops' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><Package className="w-5 h-5" /> My Listings</button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'analytics' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><Activity className="w-5 h-5" /> Analytics</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 lg:px-12 py-4 md:py-8 w-full max-w-4xl mx-auto">
        
        {activeTab !== 'dashboard' && (
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#163020] tracking-[-0.04em] mb-2">Seller Dashboard</h1>
              <p className="text-slate-500">Manage your listings and negotiate deals directly with buyers.</p>
            </div>
            <button onClick={() => setIsAddingCrop(true)} className="px-5 py-2.5 bg-[#163020] text-white rounded-full font-bold shadow-md hover:bg-emerald-900 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Listing
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="w-full">
            {/* Top Banner */}
            <div className="bg-[#0b5c43] rounded-[2rem] p-6 md:p-8 text-white relative mb-16 overflow-hidden shadow-lg">
              <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-100 font-medium mb-0.5">Location</p>
                    <p className="font-bold flex items-center gap-1.5 text-lg truncate max-w-[200px] md:max-w-[400px]">
                      <MapPin className="w-4 h-4 shrink-0"/> {userLocation}
                    </p>
                  </div>
                </div>
                <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors shrink-0">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="h-20 md:h-24"></div> 
            </div>

            {/* Metric Cards */}
            <div className="px-4 md:px-8 -mt-32 md:-mt-40 relative z-20 flex gap-4 md:gap-6 mb-10">
              <div className="bg-white rounded-[2rem] p-5 md:p-6 flex-1 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4">
                   <BarChart2 className="w-6 h-6"/>
                </div>
                <p className="text-slate-400 text-xs md:text-sm font-semibold mb-1">Market Trend</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">+4.2%</h3>
                <p className="text-slate-800 font-bold text-base md:text-lg">Up</p>
              </div>
              <div className="bg-white rounded-[2rem] p-5 md:p-6 flex-1 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
                   <CloudSun className="w-6 h-6"/>
                </div>
                <p className="text-slate-400 text-xs md:text-sm font-semibold mb-1">Weather</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Sunny •</h3>
                <p className="text-slate-800 font-bold text-base md:text-lg">28°C</p>
              </div>
            </div>

            <div className="px-2">
              {/* DISTRICT SELECTION CONTROL BAR WITH GPS */}
              <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Selected District</p>
                    <h2 className="text-lg font-bold text-slate-800">{selectedDistrict} APMC</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {/* Maharashtra District Dropdown */}
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      const newDist = e.target.value;
                      setSelectedDistrict(newDist);
                      setUserLocation(`${newDist}, Maharashtra`);
                      setUserCoordinates(null);
                      setPredictions([]);
                      setPrediction('');
                      setAnalytics(null);
                    }}
                    className="w-full sm:w-60 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer transition-colors"
                  >
                    {MAHARASHTRA_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>

                  {/* GPS Button */}
                  <button 
                    type="button" 
                    onClick={handleUseGPS} 
                    className="p-2.5 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 text-xs font-bold shadow-sm"
                  >
                    <Navigation className="w-4 h-4 text-emerald-600" /> GPS
                  </button>
                </div>
              </div>

              <h3 className="text-[#102a43] font-bold tracking-wider uppercase text-sm mb-5">AI Insights</h3>
              <div className="space-y-4">
                
                {/* AI PREDICTOR */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <Sprout className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">AI Crop Predictor</h4>
                        <p className="text-xs text-slate-500">Autonomous seasonal forecasting for {selectedDistrict}</p>
                      </div>
                    </div>
                  </div>
                  
                  {!prediction && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Soil Geology</label>
                          <select value={soilType} onChange={(e) => setSoilType(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            <option value="Black Cotton">Black Cotton</option>
                            <option value="Laterite">Laterite / Coastal</option>
                            <option value="Alluvial">Alluvial</option>
                            <option value="Red">Red Soil</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Water Access</label>
                          <button type="button" onClick={() => setHasIrrigation(!hasIrrigation)} className={`w-full p-3 rounded-xl border font-bold text-sm flex justify-center items-center gap-2 ${hasIrrigation ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <Droplets className="w-4 h-4" /> {hasIrrigation ? 'Irrigated' : 'Rainfed'}
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={handleSmartPredict} 
                        disabled={isPredicting} 
                        className="w-full bg-[#163020] text-white font-bold py-4 rounded-2xl hover:bg-emerald-900 transition-colors shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {isPredicting ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                        {isPredicting ? locationStatus || 'Analyzing...' : `Predict Capabilities for ${selectedDistrict}`}
                      </button>
                    </div>
                  )}
                  
                  {analytics && prediction && (
                    <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      
                      <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-emerald-200 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-bl-xl tracking-wide">
                          {predictions[0]?.confidence || 85}% Match Confidence
                        </div>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Optimal Cultivation Recommendation</p>
                        <p className="text-4xl font-black text-[#163020] tracking-tight">{prediction}</p>
                        <p className="text-xs font-semibold text-emerald-700/60 mt-2 flex items-center justify-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> Environmental parameters simulated for {userLocation}
                        </p>
                      </div>

                      {predictions.length > 1 && (
                        <div>
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Top Cultivation Matches</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {predictions.map((item, idx) => (
                              <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${idx === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-2.5">
                                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${idx === 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                                    #{idx + 1}
                                  </span>
                                  <span className="font-bold text-slate-800 text-sm">{item.crop}</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-600">{item.confidence}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">120-Day Seasonal Metrics</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex flex-col items-center text-center">
                            <Sun className="w-5 h-5 text-amber-500 mb-2"/>
                            <p className="text-[10px] uppercase font-bold text-amber-600/70 mb-1">Growing Degree Days</p>
                            <p className="font-bold text-amber-900 text-lg">{analytics.gdd} <span className="text-xs font-medium">units</span></p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center text-center">
                            <Droplets className="w-5 h-5 text-blue-500 mb-2"/>
                            <p className="text-[10px] uppercase font-bold text-blue-600/70 mb-1">Total Rainfall</p>
                            <p className="font-bold text-blue-900 text-lg">{analytics.total_rain} <span className="text-xs font-medium">mm</span></p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col items-center text-center">
                            <ThermometerSun className="w-5 h-5 text-red-500 mb-2"/>
                            <p className="text-[10px] uppercase font-bold text-red-600/70 mb-1">Heat Stress Days</p>
                            <p className="font-bold text-red-900 text-lg">{analytics.heat_stress} <span className="text-xs font-medium">&gt; 35°C</span></p>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex flex-col items-center text-center">
                            <AlertTriangle className="w-5 h-5 text-orange-500 mb-2"/>
                            <p className="text-[10px] uppercase font-bold text-orange-600/70 mb-1">Drought Risk</p>
                            <p className="font-bold text-orange-900 text-lg">{analytics.dry_days} <span className="text-xs font-medium">dry days</span></p>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={handleResetAnalysis} 
                        className="w-full py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 border border-slate-200 rounded-xl"
                      >
                        <RefreshCw className="w-4 h-4" /> Run New Analysis
                      </button>
                    </div>
                  )}
                </div>

                {/* LIVE APMC MANDI PRICES */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">Real Live Mandi Rates</h4>
                        <p className="text-xs text-slate-500">APMC market data in {selectedDistrict}</p>
                      </div>
                    </div>
                  </div>

                  {isLoadingMandi ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                      <p className="text-sm text-slate-400">Loading {selectedDistrict} mandis...</p>
                    </div>
                  ) : localMandiPrices.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
                      <AlertTriangle className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                      <p className="text-slate-700 font-bold text-lg">No Market Records Found</p>
                      <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">No official APMC data was uploaded for {selectedDistrict} today.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {localMandiPrices.map((crop) => {
                        const mIdx = selectedMarkets[crop.id] || 0;
                        const currentMarket = crop.markets[mIdx] || crop.markets[0];

                        return (
                          <div key={crop.id} className="rounded-2xl border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow bg-white">
                            <div className="h-32 bg-slate-100 relative">
                              <img src={crop.image} alt={crop.commodity} className="w-full h-full object-cover" />
                              <span className="absolute bottom-2 left-2 bg-white/90 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{crop.category}</span>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                              <h4 className="font-bold text-base text-slate-800 mb-1">{crop.commodity}</h4>
                              
                              {/* Market Location Selector if multiple markets exist in district */}
                              <div className="mb-2">
                                <select 
                                  value={mIdx}
                                  onChange={(e) => setSelectedMarkets({ ...selectedMarkets, [crop.id]: Number(e.target.value) })}
                                  className="w-full text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                  {crop.markets.map((m, idx) => (
                                    <option key={idx} value={idx}>{m.market}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-end">
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-slate-400">Modal Price</p>
                                  <p className="text-xl font-bold text-emerald-700">₹{currentMarket?.modal_price}<span className="text-xs font-normal text-slate-400">/q</span></p>
                                </div>
                                <div className="text-right text-[11px] text-slate-400">
                                  <p>Min: ₹{currentMarket?.min_price}</p>
                                  <p>Max: ₹{currentMarket?.max_price}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Handshake className="w-5 h-5 text-emerald-600" /> My Offers
              </h3>
            </div>
            
            {myOffers.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-500 text-center">
                <Handshake className="w-12 h-12 mb-4 text-slate-300" />
                <h4 className="font-bold text-slate-800 mb-1">No Offers Yet</h4>
                <p className="text-sm">When buyers propose deals for your listings, they will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myOffers.map(offer => {
                  const product = products.find(p => p.id === offer.productId);
                  return (
                    <div key={offer.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row gap-6">
                      {product && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg">{offer.productName}</h4>
                            <p className="text-sm text-slate-500">Buyer: <span className="font-semibold text-slate-700">{offer.buyerId}</span></p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            offer.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                            offer.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {offer.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Offered Price</p>
                            <p className="font-bold text-slate-800">₹{offer.proposedPrice} <span className="text-xs font-normal text-slate-500">/ kg</span></p>
                          </div>
                          <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Quantity Required</p>
                            <p className="font-bold text-slate-800">{offer.quantity} <span className="text-xs font-normal text-slate-500">kg</span></p>
                          </div>
                          <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Total Deal Value</p>
                            <p className="font-bold text-emerald-700">₹{(offer.proposedPrice * offer.quantity).toLocaleString()}</p>
                          </div>
                          <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Transport Terms</p>
                            <p className="font-bold text-slate-800 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-slate-500" /> {offer.transportArrangement}</p>
                          </div>
                        </div>
                        
                        {offer.message && (
                          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 mb-4">
                            <p className="text-sm text-slate-700 italic">"{offer.message}"</p>
                          </div>
                        )}
                        
                        {offer.status === 'Pending' && (
                          <div className="flex gap-3">
                            <button 
                              onClick={() => updateOfferStatus(offer.id, 'Accepted')}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Accept Offer
                            </button>
                            <button 
                              onClick={() => updateOfferStatus(offer.id, 'Declined')}
                              className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"
                            >
                              <XCircle className="w-4 h-4" /> Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'crops' && (
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">All Active Listings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100 text-sm text-slate-500">
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Asking Price</th>
                    <th className="px-6 py-4 font-medium">Available</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <AnimatePresence>
                    {products.map(product => (
                      <motion.tr 
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                          </div>
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{product.category}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">₹{product.price.toFixed(2)} / kg</td>
                        <td className="px-6 py-4 text-slate-600">{product.stock} kg</td>
                        <td className="px-6 py-4">
                          {product.stock > 0 ? (
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Active</span>
                          ) : (
                            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">Sold Out</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Activity className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Analytics Overview</h3>
            <p className="text-center max-w-md">Detailed analytics and deal completion rates will appear here as you accept more offers.</p>
          </div>
        )}

      </div>

      {/* Add Crop Modal */}
      {isAddingCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddingCrop(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Add New Listing</h2>
              <button onClick={() => setIsAddingCrop(false)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-sm">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddCrop} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Crop Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fresh Red Onions" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Asking Price (₹/kg)</label>
                  <input type="number" required min="1" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 45" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Available Stock (kg)</label>
                  <input type="number" required min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="e.g. 500" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white">
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                  <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Pune, MH" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30">
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}