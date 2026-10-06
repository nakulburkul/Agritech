import React, { useState, useEffect } from 'react';
import { Package, IndianRupee, Sprout, TrendingUp, Plus, Activity, LayoutDashboard, Settings, User, X, Handshake, CheckCircle2, XCircle, Truck, MapPin, Bell, BarChart2, CloudSun, ChevronRight, Loader2, Sun, Droplets, ThermometerSun, AlertTriangle, RefreshCw, Navigation, Megaphone, PlusCircle, Users, UserPlus, ShieldCheck, Clock, PieChart, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMarketPrices, LOCAL_BAZAARS, MAHARASHTRA_DISTRICTS } from '../services/marketApi';
import { getImageForCrop } from './CustomerPortal';

const API_BASE = `http://${window.location.hostname}:8000/api`;

// ==========================================
// LIGHTWEIGHT MULTILINGUAL DICTIONARY
// ==========================================
const dict = {
  en: {
    dashboard: "Dashboard", coops: "Co-ops & Groups", demands: "Buyer Demands", offers: "My Offers", crops: "My Listings", analytics: "Analytics",
    verified: "Verified Seller", loc: "Location", marketTrend: "Market Trend Premium", liveWeather: "Live Weather", selectedMarket: "Selected Market",
    perfAnalytics: "Performance Analytics", perfSub: "Track your closed deals, revenue, and district agro-climatic profile.",
    grossRev: "Gross Revenue", revSub: "From confirmed deals", estProfit: "Estimated Profit", profitSub: "~48% net margin after input costs",
    volSold: "Volume Sold", volSub: "Total crop tonnage fulfilled", avgRate: "Avg Selling Rate", rateSub: "above local APMC modal",
    topCrops: "Top Performing Crops", topSub: "Revenue distribution by commodity",
    atmos: "Atmospheric Condition", atmosSub: "Live telemetry for", temp: "Temperature", hum: "Rel. Humidity", wind: "Wind Speed", precip: "Precipitation Forecast", rainProb: "Surface Rain Probability",
    soil: "Soil & Mineral Profile", soilSub: "Agro-Climatic Baseline", geo: "Predominant Geology", moist: "Active Soil Moisture", ph: "Soil Reaction (pH)", npk: "NPK Readiness Index",
    opRec: "Operational Recommendations"
  },
  hi: {
    dashboard: "डैशबोर्ड", coops: "सहकारी समूह", demands: "खरीदार की मांग", offers: "मेरे प्रस्ताव", crops: "मेरी लिस्टिंग", analytics: "एनालिटिक्स",
    verified: "सत्यापित विक्रेता", loc: "स्थान", marketTrend: "बाजार का रुझान", liveWeather: "लाइव मौसम", selectedMarket: "चयनित बाजार",
    perfAnalytics: "प्रदर्शन एनालिटिक्स", perfSub: "अपने बंद सौदों, राजस्व और जिले की कृषि-जलवायु प्रोफ़ाइल को ट्रैक करें।",
    grossRev: "कुल राजस्व", revSub: "पुष्ट सौदों से", estProfit: "अनुमानित लाभ", profitSub: "इनपुट लागत के बाद ~48% शुद्ध मार्जिन",
    volSold: "बेची गई मात्रा", volSub: "कुल फसल टन भार पूरा हुआ", avgRate: "औसत बिक्री दर", rateSub: "स्थानीय APMC मोडल से ऊपर",
    topCrops: "शीर्ष प्रदर्शन करने वाली फसलें", topSub: "कमोडिटी के अनुसार राजस्व वितरण",
    atmos: "वायुमंडलीय स्थिति", atmosSub: "लाइव टेलीमेट्री", temp: "तापमान", hum: "सापेक्ष आर्द्रता", wind: "हवा की गति", precip: "वर्षा का पूर्वानुमान", rainProb: "सतह वर्षा की संभावना",
    soil: "मिट्टी और खनिज प्रोफ़ाइल", soilSub: "कृषि-जलवायु बेसलाइन", geo: "प्रमुख भूविज्ञान", moist: "सक्रिय मिट्टी की नमी", ph: "मिट्टी की प्रतिक्रिया (pH)", npk: "NPK तत्परता सूचकांक",
    opRec: "परिचालन संबंधी सिफारिशें"
  },
  mr: {
    dashboard: "डॅशबोर्ड", coops: "सहकारी गट", demands: "खरेदीदारांच्या मागण्या", offers: "माझे प्रस्ताव", crops: "माझी लिस्टिंग", analytics: "विश्लेषण",
    verified: "सत्यापित विक्रेता", loc: "स्थान", marketTrend: "बाजाराचा कल", liveWeather: "थेट हवामान", selectedMarket: "निवडलेला बाजार",
    perfAnalytics: "कामगिरी विश्लेषण", perfSub: "तुमचे पूर्ण झालेले व्यवहार, महसूल आणि जिल्ह्याच्या कृषी-हवामान प्रोफाइलचा मागोवा घ्या.",
    grossRev: "एकूण महसूल", revSub: "निश्चित केलेल्या व्यवहारांमधून", estProfit: "अंदाजित नफा", profitSub: "इनपुट खर्चानंतर ~48% निव्वळ नफा",
    volSold: "विक्री केलेले प्रमाण", volSub: "एकूण पीक टनेज पूर्ण झाले", avgRate: "सरासरी विक्री दर", rateSub: "स्थानिक APMC मोडलच्या वर",
    topCrops: "सर्वोत्तम कामगिरी करणारी पिके", topSub: "कमोडिटीनुसार महसूल वितरण",
    atmos: "वातावरणीय स्थिती", atmosSub: "थेट टेलीमेट्री", temp: "तापमान", hum: "सापेक्ष आर्द्रता", wind: "वाऱ्याचा वेग", precip: "पावसाचा अंदाज", rainProb: "पृष्ठभागावर पावसाची शक्यता",
    soil: "माती आणि खनिज प्रोफाइल", soilSub: "कृषी-हवामान बेसलाइन", geo: "प्रमुख भूविज्ञान", moist: "सक्रिय मातीतील ओलावा", ph: "मातीची प्रतिक्रिया (pH)", npk: "NPK तयारी निर्देशांक",
    opRec: "शिफारसी आणि सूचना"
  }
};

export function FarmerPortal() {
  const currentUser = localStorage.getItem('username') || '';
  
  // LANGUAGE STATE
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>('en');
  const t = dict[lang];

  const [listings, setListings] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [demands, setDemands] = useState<any[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);

  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [counterModalData, setCounterModalData] = useState<{ id: string, currentPrice: number, productName: string, buyerId: string } | null>(null);
  const [counterPrice, setCounterPrice] = useState('');

  const [directOfferModal, setDirectOfferModal] = useState<any>(null);
  const [directOfferPrice, setDirectOfferPrice] = useState('');
  const [directOfferQty, setDirectOfferQty] = useState('');
  const [useCoopStock, setUseCoopStock] = useState(false); 

  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [userLocation, setUserLocation] = useState('Pune, Maharashtra');
  const [userCoordinates, setUserCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState('');
  
  // AI PREDICTION & ANALYTICS STATE (Fix for missing Weather UI)
  const [prediction, setPrediction] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [predictAnalytics, setPredictAnalytics] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [soilType, setSoilType] = useState('Black Cotton');
  const [hasIrrigation, setHasIrrigation] = useState(false);
  
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  const [localMandiPrices, setLocalMandiPrices] = useState<any[]>([]);
  const [isLoadingMandi, setIsLoadingMandi] = useState(false);

  const [myCoop, setMyCoop] = useState<any[]>([]);
  const [nearbyFarmers, setNearbyFarmers] = useState([
    { id: 'f1', name: 'Ansel', distance: '2.4 km', crop: 'Potato', stock: 450, rating: 4.8 },
    { id: 'f2', name: 'Utsav', distance: '3.1 km', crop: 'Onion', stock: 800, rating: 4.9 },
    { id: 'f3', name: 'Varad', distance: '5.0 km', crop: 'Tomato', stock: 320, rating: 4.7 },
    { id: 'f4', name: 'Atharva', distance: '7.2 km', crop: 'Soyabean', stock: 1200, rating: 4.5 },
  ]);

  const pendingOffersCount = (offers || []).filter(o => o && o.status === 'Pending').length;
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [location, setLocation] = useState('Pune, MH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMyInventory = async () => {
    setIsLoadingInventory(true);
    try {
      const res = await fetch(`${API_BASE}/inventory/?username=${currentUser}&t=${Date.now()}`);
      const data = await res.json();
      if (data.status === 'success') setListings(data.data || []);
    } catch (err) {}
    setIsLoadingInventory(false);
  };

  const fetchMyOffers = async () => {
    try {
      const res = await fetch(`${API_BASE}/offers/?farmer=${currentUser}&t=${Date.now()}`);
      const data = await res.json();
      if (data.status === 'success') setOffers(data.data || []);
    } catch (err) {}
  };

  const fetchDemands = async () => {
    try {
      const res = await fetch(`${API_BASE}/demands/?t=${Date.now()}`);
      const data = await res.json();
      if (data.status === 'success') setDemands(data.data || []);
    } catch (err) {}
  };

  const fetchFarmerAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const res = await fetch(`${API_BASE}/farmer-analytics/?farmer=${currentUser}&district=${selectedDistrict}&t=${Date.now()}`);
      const data = await res.json();
      if (data.status === 'success') setAnalyticsData(data.data);
    } catch (err) {}
    setIsLoadingAnalytics(false);
  };

  useEffect(() => {
    fetchMyInventory();
    fetchMyOffers();
    fetchDemands();
    handleUseGPS();
  }, [currentUser]);

  useEffect(() => {
    if (selectedDistrict) {
      loadMandiPrices(selectedDistrict);
      fetchFarmerAnalytics(); 
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (activeTab === 'analytics') fetchFarmerAnalytics();
    else if (activeTab === 'offers') fetchMyOffers();
    else if (activeTab === 'crops') fetchMyInventory();
    else if (activeTab === 'demands') fetchDemands();
  }, [activeTab]);

  const loadMandiPrices = async (district: string) => {
    setIsLoadingMandi(true);
    const data = await fetchMarketPrices(district);
    setLocalMandiPrices(data || []);
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
          const detected = (data.address.suburb || data.address.neighbourhood || data.address.city || data.address.state_district || 'Pune').replace(' District', '');
          
          const matchedBazaar = LOCAL_BAZAARS.find(b => detected.toLowerCase().includes(b.toLowerCase()));
          const matchedDistrict = MAHARASHTRA_DISTRICTS.find(d => detected.toLowerCase().includes(d.toLowerCase()));
          const match = matchedBazaar || matchedDistrict || 'Pune';
          
          setSelectedDistrict(match);
          setUserLocation(`${match}, Maharashtra`);
          setUserCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setPredictions([]); setPrediction(''); setPredictAnalytics(null); setLocationStatus('');
        } catch (err) { setLocationStatus(''); }
      },
      () => setLocationStatus('')
    );
  };

  const handleSmartPredict = async () => {
    if (!selectedDistrict) return;
    setIsPredicting(true);
    setLocationStatus(`Forecasting capabilities for ${selectedDistrict}...`);
    try {
      const response = await fetch(`${API_BASE}/smart-predict/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location_name: selectedDistrict, lat: userCoordinates?.lat, lon: userCoordinates?.lng, soil: soilType, irrigation: hasIrrigation })
      });
      const data = await response.json();
      if (data.status === 'success') {
        if (data.analytics) setPredictAnalytics(data.analytics); // Saves the telemetry for UI
        if (data.predictions && data.predictions.length > 0) {
          setPredictions(data.predictions); setPrediction(data.predictions[0].crop);
        } else { setPrediction(data.prediction || 'Wheat'); }
      }
    } catch (err) {}
    setIsPredicting(false); setLocationStatus('');
  };

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/inventory/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser, crop_name: name, category, price: parseFloat(price), stock: parseInt(stock, 10) })
      });
      if (res.ok) {
        setIsAddingCrop(false); setName(''); setPrice(''); setStock(''); fetchMyInventory();
      }
    } catch (err) { alert("Failed to add listing."); }
    setIsSubmitting(false);
  };

  const handleSendDirectOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directOfferModal) return;

    try {
      const res = await fetch(`${API_BASE}/offers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_direct_farmer_offer: true,
          farmer_username: currentUser,
          buyer_username: directOfferModal.buyer__username,
          crop_name: useCoopStock ? `${directOfferModal.crop_name} (Co-op Group)` : directOfferModal.crop_name,
          proposed_price: directOfferPrice,
          quantity: directOfferQty
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        alert(useCoopStock ? "Co-op Group Offer sent successfully!" : "Direct offer sent to the buyer!");
        setDirectOfferModal(null);
        setUseCoopStock(false);
        fetchMyOffers();
        setActiveTab('offers'); 
      } else {
        alert(data.message || "Failed to send direct offer.");
      }
    } catch (err) { alert("API Connection Failed"); }
  };

  const updateOfferStatus = async (offerId: string, newStatus: string, proposedPrice?: number) => {
    const payload: any = { offer_id: offerId, status: newStatus };
    if (proposedPrice) payload.proposed_price = proposedPrice;

    try {
      const res = await fetch(`${API_BASE}/offers/`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchMyOffers();
        fetchMyInventory(); 
        fetchFarmerAnalytics();
      }
    } catch (err) { alert("Failed to update status."); }
  };

  const submitCounterOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (counterModalData && counterPrice && !isNaN(Number(counterPrice))) {
      await updateOfferStatus(counterModalData.id, 'Countered', parseFloat(counterPrice));
      setCounterModalData(null);
      setCounterPrice('');
    }
  };

  const inviteToCoop = (farmer: any) => {
    setMyCoop([...myCoop, farmer]);
    setNearbyFarmers(nearbyFarmers.filter(f => f.id !== farmer.id));
  };

  const removeFromCoop = (farmer: any) => {
    setNearbyFarmers([...nearbyFarmers, farmer]);
    setMyCoop(myCoop.filter(f => f.id !== farmer.id));
  };

  const calculateMarketTrend = () => {
    if (!localMandiPrices || localMandiPrices.length === 0) return { val: '0.0%', type: 'stable' };
    let totalPremium = 0, validCount = 0;
    localMandiPrices.forEach(item => {
      const minP = Number(item.min_price) || 0;
      const modP = Number(item.modal_price) || 0;
      if (minP > 0 && modP > 0) {
        totalPremium += ((modP - minP) / minP) * 100;
        validCount++;
      }
    });
    if (validCount === 0) return { val: '0.0%', type: 'stable' };
    const avgPremium = totalPremium / validCount;
    const type = avgPremium > 12 ? 'up' : avgPremium < 4 ? 'down' : 'stable';
    return { val: `${avgPremium > 0 ? '+' : ''}${avgPremium.toFixed(1)}%`, type };
  };

  const marketTrend = calculateMarketTrend();
  const validStatuses = ['Accepted', 'Escrow Funded', 'In Transit', 'Completed', 'Paid'];
  const confirmedDeals = (offers || []).filter(o => validStatuses.includes(o.status));
  
  const calcRevenue = confirmedDeals.reduce((sum, o) => sum + ((Number(o.proposedPrice) || 0) * (Number(o.quantity) || 0)), 0);
  const calcVolume = confirmedDeals.reduce((sum, o) => sum + (Number(o.quantity) || 0), 0);
  const calcProfit = calcRevenue * 0.48; 
  const calcAvg = calcVolume > 0 ? (calcRevenue / calcVolume).toFixed(2) : 0;

  const cropDistribution = confirmedDeals.reduce((acc: any, o) => {
    const name = o.productName || 'Other';
    acc[name] = (acc[name] || 0) + ((Number(o.proposedPrice) || 0) * (Number(o.quantity) || 0));
    return acc;
  }, {});
  const topCrops = Object.entries(cropDistribution).sort((a: any, b: any) => b[1] - a[1]).slice(0, 3);

  const weatherTemp = analyticsData?.weather?.temperature ?? '--';
  const rainChance = analyticsData?.weather?.precipitation_chance ?? 0;
  const weatherCondition = rainChance > 25 ? 'Rainy' : (analyticsData?.weather?.humidity > 70 ? 'Cloudy' : 'Sunny');

  const getTabTitle = () => {
    if (activeTab === 'coops') return t.coops;
    if (activeTab === 'demands') return t.demands;
    if (activeTab === 'offers') return t.offers;
    if (activeTab === 'crops') return t.crops;
    if (activeTab === 'analytics') return t.perfAnalytics;
    return t.dashboard;
  };

  const getTabSub = () => {
    if (activeTab === 'coops') return 'Pool your stock with nearby farmers to fulfill massive bulk orders.';
    if (activeTab === 'demands') return 'Fulfill open market requirements directly.';
    if (activeTab === 'offers') return 'Manage incoming bids and negotiate with buyers.';
    if (activeTab === 'crops') return 'Control your active market inventory.';
    if (activeTab === 'analytics') return t.perfSub;
    return 'Manage your agribusiness operations.';
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 flex flex-col md:flex-row pb-16">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 px-6 py-8 hidden md:block shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg border border-slate-200 shadow-inner">
            {currentUser ? currentUser.charAt(0).toUpperCase() : 'F'}
          </div>
          <div>
            <p className="font-bold text-slate-800">{currentUser || 'Farmer'}</p>
            <p className="text-xs text-emerald-600 font-semibold">{t.verified}</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><LayoutDashboard className="w-5 h-5" /> {t.dashboard}</button>
          <button onClick={() => setActiveTab('coops')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'coops' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
            <div className="flex items-center gap-3"><Users className="w-5 h-5" /> {t.coops}</div>
            {myCoop.length > 0 && <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{myCoop.length}</span>}
          </button>
          <button onClick={() => setActiveTab('demands')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'demands' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Megaphone className="w-5 h-5" /> {t.demands}
          </button>
          <button onClick={() => setActiveTab('offers')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'offers' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
            <div className="flex items-center gap-3"><Handshake className="w-5 h-5" /> {t.offers}</div>
            {pendingOffersCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingOffersCount}</span>}
          </button>
          <button onClick={() => setActiveTab('crops')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'crops' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><Package className="w-5 h-5" /> {t.crops}</button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'analytics' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><Activity className="w-5 h-5" /> {t.analytics}</button>
        </nav>
      </aside>

      {/* MAIN PORTAL AREA */}
      <div className="flex-1 px-4 md:px-6 lg:px-12 py-4 md:py-8 w-full max-w-5xl mx-auto">
        
        {/* HEADER & LANGUAGE TOGGLE */}
        {activeTab !== 'dashboard' && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#163020] tracking-[-0.04em] mb-2">
                {getTabTitle()}
              </h1>
              <p className="text-slate-500">
                {getTabSub()}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm shrink-0">
                  <Globe2 className="w-4 h-4 text-emerald-600 mr-2" />
                  <select value={lang} onChange={(e: any) => setLang(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none cursor-pointer">
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="mr">मराठी (Marathi)</option>
                  </select>
              </div>

              {activeTab !== 'coops' && activeTab !== 'analytics' && (
                <button onClick={() => setIsAddingCrop(true)} className="w-full sm:w-auto px-5 py-2.5 bg-[#163020] text-white rounded-full font-bold shadow-md hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 text-sm shrink-0">
                  <Plus className="w-4 h-4" /> Add New Listing
                </button>
              )}
            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="w-full">
            <div className="bg-[#0b5c43] rounded-[2rem] p-6 md:p-8 text-white relative mb-16 overflow-hidden shadow-lg">
              <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-700/50 rounded-full overflow-hidden border-2 border-white/20 shrink-0 flex items-center justify-center font-bold text-xl">
                    {currentUser ? currentUser.charAt(0).toUpperCase() : 'F'}
                  </div>
                  <div>
                    <p className="text-xs text-emerald-100 font-medium mb-0.5">{t.loc}</p>
                    <p className="font-bold flex items-center gap-1.5 text-lg truncate max-w-[200px] md:max-w-[400px]"><MapPin className="w-4 h-4 shrink-0"/> {userLocation}</p>
                  </div>
                </div>
                {/* Dashboard Lang Toggle */}
                <div className="hidden sm:flex items-center bg-emerald-800/50 border border-emerald-600 rounded-full px-3 py-1.5 backdrop-blur-sm">
                    <Globe2 className="w-4 h-4 text-emerald-300 mr-2" />
                    <select value={lang} onChange={(e: any) => setLang(e.target.value)} className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer">
                        <option value="en" className="text-slate-800">English</option>
                        <option value="hi" className="text-slate-800">हिंदी</option>
                        <option value="mr" className="text-slate-800">मराठी</option>
                    </select>
                </div>
              </div>
              <div className="h-20 md:h-24"></div> 
            </div>

            <div className="px-4 md:px-8 -mt-32 md:-mt-40 relative z-20 flex gap-4 md:gap-6 mb-10">
              <div className="bg-white rounded-[2rem] p-5 md:p-6 flex-1 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  marketTrend.type === 'up' ? 'bg-emerald-50 text-emerald-500' :
                  marketTrend.type === 'down' ? 'bg-red-50 text-red-500' :
                  'bg-blue-50 text-blue-500'
                }`}>
                  <BarChart2 className="w-6 h-6"/>
                </div>
                <p className="text-slate-400 text-xs md:text-sm font-semibold mb-1">{t.marketTrend}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                  {isLoadingMandi ? <Loader2 className="w-5 h-5 animate-spin text-slate-300 inline-block"/> : marketTrend.val}
                </h3>
                <p className="text-slate-800 font-bold text-base md:text-lg capitalize">
                  {isLoadingMandi ? '...' : marketTrend.type}
                </p>
              </div>

              <div className="bg-white rounded-[2rem] p-5 md:p-6 flex-1 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
                  {weatherCondition === 'Rainy' ? <Droplets className="w-6 h-6 text-blue-500"/> :
                   weatherCondition === 'Cloudy' ? <CloudSun className="w-6 h-6 text-slate-500"/> :
                   <Sun className="w-6 h-6 text-orange-500"/>}
                </div>
                <p className="text-slate-400 text-xs md:text-sm font-semibold mb-1">{t.liveWeather}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                  {isLoadingAnalytics ? <Loader2 className="w-5 h-5 animate-spin text-slate-300 inline-block"/> : `${weatherCondition} •`}
                </h3>
                <p className="text-slate-800 font-bold text-base md:text-lg">
                  {isLoadingAnalytics ? '...' : `${weatherTemp}°C`}
                </p>
              </div>
            </div>

            <div className="px-2">
              <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">{t.selectedMarket}</p>
                    <h2 className="text-lg font-bold text-slate-800">{selectedDistrict}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      const newDist = e.target.value; 
                      setSelectedDistrict(newDist); 
                      setUserLocation(`${newDist}, Maharashtra`);
                      setUserCoordinates(null); 
                      setPredictions([]); 
                      setPrediction('');
                      setPredictAnalytics(null);
                    }}
                    className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer transition-colors"
                  >
                    <optgroup label="📍 Mumbai Retail Bazaars">
                      {LOCAL_BAZAARS.map(b => <option key={b} value={b}>{b} Bazaar</option>)}
                    </optgroup>
                    <optgroup label="🏢 Maharashtra Wholesale APMC">
                      {MAHARASHTRA_DISTRICTS.map(d => <option key={d} value={d}>{d} APMC</option>)}
                    </optgroup>
                  </select>
                  <button type="button" onClick={handleUseGPS} className="p-2.5 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 text-xs font-bold shadow-sm">
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
                      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0"><Sprout className="w-6 h-6" /></div>
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
                      <button onClick={handleSmartPredict} disabled={isPredicting} className="w-full bg-[#163020] text-white font-bold py-4 rounded-2xl hover:bg-emerald-900 transition-colors shadow-md disabled:opacity-70 flex items-center justify-center gap-2">
                        {isPredicting ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                        {isPredicting ? locationStatus || 'Analyzing...' : `Predict Capabilities for ${selectedDistrict}`}
                      </button>
                    </div>
                  )}
                  
                  {prediction && (
                    <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-emerald-200 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-bl-xl tracking-wide">{predictions[0]?.confidence || 85}% Match Confidence</div>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Optimal Cultivation Recommendation</p>
                        <p className="text-4xl font-black text-[#163020] tracking-tight">{prediction}</p>
                        <p className="text-xs font-semibold text-emerald-700/60 mt-2 flex items-center justify-center gap-1"><MapPin className="w-3.5 h-3.5" /> Simulated for {userLocation}</p>
                      </div>

                      {/* WEATHER TELEMETRY GRID */}
                      {predictAnalytics && (
                        <div>
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Projected Seasonal Agro-Climate Telemetry</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Thermal Units</p>
                              <p className="text-lg font-black text-slate-800">{predictAnalytics.gdd} <span className="text-xs font-normal text-slate-500">GDD</span></p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Heat accumulation</p>
                            </div>
                            <div className="p-3.5 bg-orange-50/70 border border-orange-100 rounded-xl text-center">
                              <p className="text-[10px] uppercase font-bold text-orange-600 mb-1">Heat Stress</p>
                              <p className="text-lg font-black text-orange-700">{predictAnalytics.heat_stress} <span className="text-xs font-normal text-orange-600">Days</span></p>
                              <p className="text-[10px] text-orange-500 mt-0.5">&gt;35°C threshold</p>
                            </div>
                            <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl text-center">
                              <p className="text-[10px] uppercase font-bold text-amber-600 mb-1">Dry Spells</p>
                              <p className="text-lg font-black text-amber-700">{predictAnalytics.dry_days} <span className="text-xs font-normal text-amber-600">Days</span></p>
                              <p className="text-[10px] text-amber-500 mt-0.5">Zero rain days</p>
                            </div>
                            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-center">
                              <p className="text-[10px] uppercase font-bold text-blue-600 mb-1">Rain Forecast</p>
                              <p className="text-lg font-black text-blue-700">{predictAnalytics.total_rain} <span className="text-xs font-normal text-blue-600">mm</span></p>
                              <p className="text-[10px] text-blue-500 mt-0.5">Seasonal volume</p>
                            </div>
                          </div>

                          {predictAnalytics.climate_report && (
                            <div className="mt-3 p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start gap-2.5">
                              <ThermometerSun className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                              <p className="text-xs text-blue-900 leading-relaxed font-medium">
                                {predictAnalytics.climate_report}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {predictions.length > 1 && (
                        <div>
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Top Cultivation Matches</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {predictions.map((item, idx) => (
                              <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${idx === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-2.5">
                                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${idx === 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>#{idx + 1}</span>
                                  <span className="font-bold text-slate-800 text-sm">{item.crop}</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-600">{item.confidence}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <button onClick={() => { setPrediction(''); setPredictions([]); setPredictAnalytics(null); }} className="w-full py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 border border-slate-200 rounded-xl">
                        <RefreshCw className="w-4 h-4" /> Run New Analysis
                      </button>
                    </div>
                  )}
                </div>

                {/* LIVE MANDI & BAZAAR PRICES */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><TrendingUp className="w-6 h-6" /></div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">Live Market Rates</h4>
                        <p className="text-xs text-slate-500">Live price feed in {selectedDistrict}</p>
                      </div>
                    </div>
                  </div>

                  {isLoadingMandi ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                      <p className="text-sm text-slate-400">Loading {selectedDistrict} rates...</p>
                    </div>
                  ) : localMandiPrices.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
                      <AlertTriangle className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                      <p className="text-slate-700 font-bold text-lg">No Records Found</p>
                      <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">No market data records available for {selectedDistrict}.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {localMandiPrices.map((crop, idx) => (
                        <div key={crop.id || idx} className="rounded-2xl border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow bg-white">
                          <div className="h-32 bg-slate-100 relative">
                            {/* DYNAMIC SMART IMAGE */}
                            <img src={getImageForCrop(crop.commodity)} alt={crop.commodity} className="w-full h-full object-cover" />
                            <span className="absolute bottom-2 left-2 bg-white/90 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{crop.category || 'Commodity'}</span>
                          </div>
                          <div className="p-4 flex flex-col flex-1">
                            <h4 className="font-bold text-base text-slate-800 mb-1">{crop.commodity || 'Unknown'}</h4>
                            <p className="text-xs text-slate-400 mb-3">{crop.market || selectedDistrict}</p>
                            <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-end">
                              <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Modal Price</p>
                                <p className="text-xl font-bold text-emerald-700">₹{crop.modal_price || 0}<span className="text-xs font-normal text-slate-400">/{crop.unit || 'kg'}</span></p>
                              </div>
                              <div className="text-right text-[11px] text-slate-400">
                                <p>Min: ₹{crop.min_price || 0}</p>
                                <p>Max: ₹{crop.max_price || 0}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CO-OPS & GROUPS TAB */}
        {activeTab === 'coops' && (
          <div className="animate-in fade-in space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" /> Farmers Near {selectedDistrict}
                  </h3>
                </div>
                {nearbyFarmers.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <p>No more farmers nearby to invite.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {nearbyFarmers.map(farmer => (
                      <div key={farmer.id} className="p-5 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-200">{farmer.name.charAt(0)}</div>
                          <div>
                            <h4 className="font-bold text-slate-800">{farmer.name} <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-1">★ {farmer.rating}</span></h4>
                            <p className="text-xs text-slate-500">Has {farmer.stock}kg of {farmer.crop} • {farmer.distance} away</p>
                          </div>
                        </div>
                        <button onClick={() => inviteToCoop(farmer)} className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-1.5 hover:bg-emerald-50 transition-colors shadow-sm"><UserPlus className="w-4 h-4" /> Invite</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-[#0b5c43] border border-emerald-900 rounded-3xl overflow-hidden shadow-lg text-white">
                <div className="px-6 py-5 border-b border-emerald-800/50 bg-[#084b36]">
                  <h3 className="font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-300" /> My Active Co-op</h3>
                  <p className="text-xs text-emerald-200/70 mt-1">Pool stock to fulfill massive demands.</p>
                </div>
                <div className="p-6">
                  {myCoop.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-emerald-600/50 mx-auto mb-3" />
                      <p className="text-sm text-emerald-100/70">You are operating independently.</p>
                      <p className="text-xs text-emerald-200/50 mt-1">Invite nearby farmers to form a group.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-[#084b36] p-3 rounded-xl border border-emerald-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-xs font-bold shadow-inner">You</div>
                          <div><p className="text-sm font-bold text-white">Group Leader</p></div>
                        </div>
                      </div>
                      {myCoop.map(member => (
                        <div key={member.id} className="flex items-center justify-between bg-emerald-800/40 p-3 rounded-xl border border-emerald-700/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">{member.name.charAt(0)}</div>
                            <div>
                              <p className="text-sm font-bold text-emerald-50">{member.name}</p>
                              <p className="text-[10px] text-emerald-200/70">+{member.stock}kg {member.crop}</p>
                            </div>
                          </div>
                          <button onClick={() => removeFromCoop(member)} className="w-6 h-6 rounded-full bg-red-500/20 text-red-300 flex items-center justify-center hover:bg-red-50 hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <div className="mt-6 pt-4 border-t border-emerald-700/50">
                        <p className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider mb-2">Total Pooled Capacity</p>
                        <h4 className="text-2xl font-black text-white">{myCoop.reduce((acc, curr) => acc + curr.stock, 0)} <span className="text-sm font-normal text-emerald-200">kg added</span></h4>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OPEN BUYER DEMANDS TAB - UPGRADED TO TICKETS */}
        {activeTab === 'demands' && (
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-600" /> Open Buyer Demands
              </h3>
            </div>
            {demands.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-500 text-center">
                <Megaphone className="w-12 h-12 mb-4 text-slate-300" />
                <h4 className="font-bold text-slate-800 mb-1">No Open Demands</h4>
                <p className="text-sm">Buyers haven't posted any specific crop requirements yet.</p>
              </div>
            ) : (
              <div className="p-6 space-y-6 bg-white">
                {demands.map((demand: any) => {
                  const requiredQty = parseInt(demand.quantity, 10) || 0;

                  return (
                    <div key={demand.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow">
                      <div className="w-full md:w-2 bg-emerald-500 h-2 md:h-auto shrink-0"></div>
                      
                      <div className="p-6 flex-1 flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Active Demand Ticket</span>
                            <span className="text-xs font-semibold text-slate-400">Posted on {new Date(demand.created_at).toLocaleDateString()}</span>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-slate-800 mb-4">{demand.crop_name}</h3>
                          
                          <div className="flex flex-wrap gap-6 mb-4">
                            <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                              <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Target Price</p>
                              <p className="font-black text-emerald-700 text-lg">₹{demand.expected_price}<span className="text-sm font-medium text-slate-500">/kg</span></p>
                            </div>
                            <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                              <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Required Quantity</p>
                              <p className="font-bold text-slate-800 text-lg">{demand.quantity} <span className="text-sm font-medium text-slate-500">kg</span></p>
                            </div>
                            <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                              <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Buyer</p>
                              <p className="font-bold text-slate-800 text-lg">{demand.buyer__username}</p>
                            </div>
                          </div>
                          
                          {demand.description && (
                            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-sm text-slate-600 italic">
                              "{demand.description}"
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 min-w-[200px]">
                            
                            {myCoop.length > 0 && requiredQty > 500 ? (
                                <button 
                                  onClick={() => {
                                    setDirectOfferModal(demand);
                                    setDirectOfferPrice(demand.expected_price);
                                    setDirectOfferQty(demand.quantity);
                                    setUseCoopStock(true); 
                                  }} 
                                  className="w-full py-3.5 bg-[#0b5c43] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-900 transition-colors shadow-sm"
                                >
                                  <ShieldCheck className="w-4 h-4" /> Fulfill via Co-op
                                </button>
                            ) : (
                                <button 
                                  onClick={() => {
                                    setDirectOfferModal(demand);
                                    setDirectOfferPrice(demand.expected_price);
                                    setDirectOfferQty(demand.quantity);
                                    setUseCoopStock(false);
                                  }} 
                                  className="w-full py-3.5 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
                                >
                                  <Handshake className="w-4 h-4" /> Send Direct Offer
                                </button>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* OFFERS TAB WITH ESCROW TRACKING - UPGRADED FONTS */}
        {activeTab === 'offers' && (
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Handshake className="w-5 h-5 text-emerald-600" /> My Offers
              </h3>
            </div>
            
            {offers.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-500 text-center">
                <Handshake className="w-12 h-12 mb-4 text-slate-300" />
                <h4 className="font-bold text-slate-800 mb-1">No Offers Yet</h4>
                <p className="text-sm">When buyers propose deals for your listings, they will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {offers.map(offer => (
                  <div key={offer.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row items-start md:items-center gap-6">
                    
                    {/* DYNAMIC SMART IMAGE */}
                    <img src={getImageForCrop(offer.productName)} alt={offer.productName} className="w-32 h-32 rounded-2xl object-cover shrink-0 shadow-sm border border-slate-100" />
                    
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-2xl text-slate-800">{offer.productName}</h4>
                          <p className="text-sm text-slate-500 mt-0.5">Buyer: <span className="font-semibold text-slate-700">{offer.buyerId}</span></p>
                          
                          {offer.farmerId && String(offer.farmerId).includes('Co-op') && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                              <ShieldCheck className="w-3 h-3" /> Fulfilling as Co-op Group
                            </span>
                          )}
                        </div>
                        
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                          offer.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          offer.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          offer.status === 'Escrow Funded' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          offer.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          offer.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          offer.status === 'Declined' ? 'bg-red-50 text-red-700 border-red-200' :
                          offer.status === 'Countered' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {offer.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                          {offer.status === 'Accepted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {offer.status === 'Escrow Funded' && <ShieldCheck className="w-3.5 h-3.5" />}
                          {offer.status === 'In Transit' && <Truck className="w-3.5 h-3.5" />}
                          {offer.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {offer.status === 'Countered' ? 'Waiting on Buyer' : offer.status}
                        </span>
                      </div>
                      
                      {/* BIG BOLD FONT FOR DEALS */}
                      <div className="flex flex-wrap gap-4 text-sm mt-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="min-w-[90px]">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Offered Price</p>
                          <p className="font-bold text-slate-800 text-lg">₹{offer.proposedPrice}<span className="text-xs text-slate-500 font-medium">/kg</span></p>
                        </div>
                        <div className="w-px bg-slate-200 mx-1 hidden sm:block"></div>
                        <div className="min-w-[90px]">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Quantity</p>
                          <p className="font-bold text-slate-800 text-lg">{offer.quantity} <span className="text-xs text-slate-500 font-medium">kg</span></p>
                        </div>
                        <div className="w-px bg-slate-200 mx-1 hidden sm:block"></div>
                        <div className="min-w-[90px]">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Value</p>
                          <p className="font-black text-emerald-700 text-xl">₹{((offer.proposedPrice || 0) * (offer.quantity || 0)).toLocaleString()}</p>
                        </div>
                      </div>

                      {offer.status === 'Escrow Funded' && <p className="text-xs text-purple-600 mt-4 font-semibold flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> Funds are Secured in Escrow. It is safe to dispatch the goods.</p>}
                      {offer.status === 'In Transit' && <p className="text-xs text-blue-600 mt-4 font-semibold flex items-center gap-1.5"><Truck className="w-4 h-4"/> Goods Dispatched. Waiting for Buyer to confirm delivery.</p>}
                      {offer.status === 'Completed' && <p className="text-xs text-emerald-700 mt-4 font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Buyer confirmed delivery. Funds have been released to your Bank Account!</p>}
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                      {offer.status === 'Pending' && (
                        <>
                          <button onClick={() => updateOfferStatus(offer.id, 'Accepted')} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-sm hover:bg-emerald-700 transition-colors">
                            Accept Offer
                          </button>
                          
                          <button 
                            onClick={() => {
                              setCounterModalData({ id: offer.id, currentPrice: offer.proposedPrice, productName: offer.productName, buyerId: offer.buyerId });
                              setCounterPrice('');
                            }} 
                            className="px-6 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl text-sm border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            Counter Offer
                          </button>

                          <button onClick={() => updateOfferStatus(offer.id, 'Declined')} className="px-6 py-3 bg-white text-slate-600 border border-slate-200 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors">Decline</button>
                        </>
                      )}

                      {offer.status === 'Escrow Funded' && (
                        <button onClick={() => updateOfferStatus(offer.id, 'In Transit')} className="px-6 py-3 bg-[#0b5c43] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-900 transition-colors">
                          <Truck className="w-4 h-4" /> Mark as Dispatched
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LISTINGS INVENTORY TAB */}
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
                  {isLoadingInventory ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-2" />
                        <p className="text-slate-500">Loading your inventory...</p>
                      </td>
                    </tr>
                  ) : listings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                        You have no active listings yet. Click "Add New Listing" to get started.
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {listings.map((product) => (
                        <motion.tr key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                {/* DYNAMIC SMART IMAGE */}
                                <img src={getImageForCrop(product.name)} className="w-full h-full object-cover" alt={product.name} />
                            </div>
                            {product.name}
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{product.category}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium">₹{product.price.toFixed(2)} / kg</td>
                          <td className="px-6 py-4 text-emerald-600 font-bold">{product.stock} kg remaining</td>
                          <td className="px-6 py-4">
                            {product.stock > 0 ? <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Active</span> : <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">Sold Out</span>}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MULTILINGUAL INDESTRUCTIBLE ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 1. FINANCIAL SUMMARY KPI ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.grossRev}</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">₹</div>
                </div>
                <p className="text-2xl font-black text-slate-800">
                  ₹{calcRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-emerald-600 font-semibold mt-1">{t.revSub}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.estProfit}</span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold"><TrendingUp className="w-4 h-4"/></div>
                </div>
                <p className="text-2xl font-black text-emerald-700">
                  ₹{calcProfit.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-1">{t.profitSub}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.volSold}</span>
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold"><Package className="w-4 h-4"/></div>
                </div>
                <p className="text-2xl font-black text-slate-800">
                  {calcVolume.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg</span>
                </p>
                <p className="text-xs text-slate-400 font-medium mt-1">{t.volSub}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.avgRate}</span>
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold">⚡</div>
                </div>
                <p className="text-2xl font-black text-slate-800">
                  ₹{calcAvg} <span className="text-sm font-normal text-slate-400">/kg</span>
                </p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{t.rateSub}</p>
              </div>
            </div>

            {/* TOP PERFORMING CROPS */}
            {topCrops.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <PieChart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{t.topCrops}</h3>
                      <p className="text-xs text-slate-400">{t.topSub}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {topCrops.map(([cropName, rev]: any, idx: number) => {
                    const percentage = Math.round((rev / calcRevenue) * 100);
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <p className="w-24 font-bold text-slate-700 text-sm truncate">{cropName}</p>
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-blue-500' : 'bg-indigo-400'}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                        <p className="w-24 text-right font-bold text-slate-800 text-sm">₹{rev.toLocaleString()}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* REAL-TIME WEATHER & SOIL CARD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{t.atmos}</h3>
                      <p className="text-xs text-slate-400">{t.atmosSub} {selectedDistrict}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">Live Open-Meteo</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-xl text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t.temp}</p>
                    <p className="text-xl font-bold text-slate-800">{weatherTemp}°C</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t.hum}</p>
                    <p className="text-xl font-bold text-slate-800">{analyticsData?.weather?.humidity ?? 60}%</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t.wind}</p>
                    <p className="text-xl font-bold text-slate-800">{analyticsData?.weather?.wind_speed ?? 12} <span className="text-xs font-normal">km/h</span></p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-xs font-bold text-blue-900">{t.precip}</p>
                    <p className="text-xs text-blue-700">{t.rainProb}: {rainChance} mm</p>
                  </div>
                  <Droplets className="w-6 h-6 text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{t.soil}</h3>
                      <p className="text-xs text-slate-400">{t.soilSub}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{analyticsData?.soil?.soil_type?.split(' ')[0] || 'Regional'} Profile</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-50">
                    <span className="text-slate-500 font-medium">{t.geo}:</span>
                    <span className="font-bold text-slate-800">{analyticsData?.soil?.soil_type ?? 'Black Cotton Soil'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-50">
                    <span className="text-slate-500 font-medium">{t.moist}:</span>
                    <span className="font-bold text-emerald-600">{analyticsData?.soil?.current_moisture_pct ?? 26}% (Adequate)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-50">
                    <span className="text-slate-500 font-medium">{t.ph}:</span>
                    <span className="font-bold text-slate-800">{analyticsData?.soil?.ph ?? '7.8 (Alkaline)'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-50">
                    <span className="text-slate-500 font-medium">{t.npk}:</span>
                    <span className="font-bold text-slate-800">N: {analyticsData?.soil?.nitrogen?.split(' ')[0] ?? 'Low'} | P: {analyticsData?.soil?.phosphorus?.split(' ')[0] ?? 'Med'} | K: {analyticsData?.soil?.potassium?.split(' ')[0] ?? 'High'}</span>
                  </div>
                </div>
                
                {/* NEW SCIENTIFIC SOIL EXPLANATION */}
                {analyticsData?.soil?.description && (
                  <div className="mt-4 p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-sm text-slate-600 leading-relaxed italic">
                    {analyticsData.soil.description}
                  </div>
                )}
              </div>
            </div>

            {/* ADVISORY & RECOMMENDATIONS */}
            <div className="bg-[#163020] text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">{t.opRec}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {confirmedDeals.length > 0 ? (
                   <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-sm leading-relaxed">
                     ✅ You have successfully completed {confirmedDeals.length} deals generating ₹{calcRevenue.toLocaleString()} in revenue. Consider pooling your high-demand items into a Farmer Co-op to fulfill massive bulk orders.
                   </div>
                ) : (
                   <div className="p-4 rounded-xl bg-white/10 text-sm">
                     Record more confirmed deals to unlock predictive seasonal margin curves.
                   </div>
                )}
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-sm leading-relaxed">
                  Soil moisture is currently optimal for vegetative growth based on local {selectedDistrict} telemetry. Avoid nitrogen over-application.
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODALS */}
      {isAddingCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddingCrop(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Add New Listing</h2>
              <button onClick={() => setIsAddingCrop(false)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-sm"><X className="w-4 h-4" /></button>
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
                <button disabled={isSubmitting} type="submit" className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30 disabled:opacity-70">
                  {isSubmitting ? 'Saving...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUNTER OFFER MODAL */}
      {counterModalData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Counter Offer</h2>
              <button onClick={() => setCounterModalData(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
              <p className="text-sm text-blue-900 leading-relaxed">
                Buyer <strong className="font-bold text-blue-950">{counterModalData.buyerId}</strong> proposed an offer of <strong className="font-black text-blue-950 text-base">₹{counterModalData.currentPrice}/kg</strong> for <strong>{counterModalData.productName}</strong>.
              </p>
            </div>
            
            <form onSubmit={submitCounterOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Counter Asking Price (₹/kg)</label>
                <input 
                  type="number" required min="1" value={counterPrice} 
                  onChange={(e) => setCounterPrice(e.target.value)} 
                  placeholder="Enter counter price" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-lg font-bold text-slate-800" 
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setCounterModalData(null)} className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-colors">Send Counter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIRECT PRIVATE OFFER MODAL */}
      {directOfferModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Send Direct Offer</h2>
              <button onClick={() => setDirectOfferModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-6">
              <p className="text-sm text-emerald-900 leading-relaxed">
                You are proposing a private deal directly to <strong className="font-bold text-emerald-950">{directOfferModal.buyer__username}</strong> for <strong>{directOfferModal.crop_name}</strong>. This will not be listed on the public market.
              </p>
            </div>
            
            <form onSubmit={handleSendDirectOffer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price (₹/kg)</label>
                  <input type="number" required min="1" value={directOfferPrice} onChange={(e) => setDirectOfferPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white font-bold text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quantity (kg)</label>
                  <input type="number" required min="1" value={directOfferQty} onChange={(e) => setDirectOfferQty(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white font-bold text-slate-800" />
                </div>
              </div>
              
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setDirectOfferModal(null)} className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30">Send Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}