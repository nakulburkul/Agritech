import React, { useState, useEffect } from 'react';
import { Search, MapPin, ArrowUpRight, ArrowDownRight, Minus as MinusIcon, Loader2, Navigation, Package, Handshake, PlusCircle, CheckCircle2, CreditCard, QrCode, ReceiptText, Clock, XCircle, AlertTriangle, Truck, X, Megaphone, Leaf, ShieldCheck } from 'lucide-react';
import { fetchMarketPrices, LOCAL_BAZAARS, MAHARASHTRA_DISTRICTS } from '../services/marketApi';

const API_BASE = `http://${window.location.hostname}:8000/api`;

// ==========================================
// SMART IMAGE ROUTER (Fixes the Tomato Bug)
// ==========================================
const getImageForCrop = (cropName: string) => {
  const name = (cropName || '').toLowerCase();
  if (name.includes('tomato')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80';
  if (name.includes('onion')) return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&q=80';
  if (name.includes('potato')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80';
  if (name.includes('dragon fruit') || name.includes('dragonfruit')) return 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=500&q=80';
  if (name.includes('apple')) return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=500&q=80';
  if (name.includes('wheat')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80';
  if (name.includes('soyabean') || name.includes('soybean')) return 'https://images.unsplash.com/photo-1599814880998-132d75f284b3?w=500&q=80';
  if (name.includes('cotton')) return 'https://images.unsplash.com/photo-1585864197775-685baf34f40f?w=500&q=80';
  if (name.includes('chilli')) return 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&q=80';
  if (name.includes('bhindi') || name.includes('lady')) return 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=500&q=80';
  if (name.includes('corn') || name.includes('maize')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&q=80';
  if (name.includes('fruit')) return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80';
  return 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&q=80'; // Generic Vegetables fallback
};

function CommodityCard({ item }: { item: any }) { 
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100 shrink-0">
        <img src={item.image || getImageForCrop(item.commodity)} alt={item.commodity} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-wider z-10 shadow-sm">
          {item.category || 'Commodity'}
        </div>
        {item.is_live_scraped && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md animate-pulse">
            Live Rate
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-xl text-slate-800">{item.commodity || 'Unknown'}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-600" /> {item.market || 'Mandi'}
            </p>
          </div>
          <span className="text-[11px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">
            {item.variety || 'Standard'}
          </span>
        </div>
        
        <div className="my-4">
          <p className="text-xs text-slate-400 font-semibold uppercase">Modal Rate</p>
          <p className="text-3xl font-black text-emerald-700 tracking-tight">
            ₹{item.modal_price || 0}
            <span className="text-sm font-normal text-slate-500"> / {item.unit || 'kg'}</span>
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-auto text-xs">
          <div>
            <p className="text-slate-400">Min Rate</p>
            <p className="font-bold text-slate-700">₹{item.min_price || 0}/{item.unit || 'kg'}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400">Max Rate</p>
            <p className="font-bold text-slate-700">₹{item.max_price || 0}/{item.unit || 'kg'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomerPortal() {
  const currentUser = localStorage.getItem('username') || '';

  const [activeTab, setActiveTab] = useState<'market' | 'direct' | 'deals' | 'demands'>('market');
  const [selectedLocation, setSelectedLocation] = useState('Borivali');
  const [marketSearchTerm, setMarketSearchTerm] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  const [commodities, setCommodities] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [myDeals, setMyDeals] = useState<any[]>([]);
  const [myDemands, setMyDemands] = useState<any[]>([]); 
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerQuantity, setOfferQuantity] = useState('');
  const [transport, setTransport] = useState('Trade by our Third Party Logistics');
  const [deliveryDistrict, setDeliveryDistrict] = useState('Borivali');
  
  const [buyerCounterModal, setBuyerCounterModal] = useState<any>(null);
  const [buyerCounterPrice, setBuyerCounterPrice] = useState('');

  const [showDemandModal, setShowDemandModal] = useState(false);
  const [demandCrop, setDemandCrop] = useState('');
  const [demandPrice, setDemandPrice] = useState('');
  const [demandQty, setDemandQty] = useState('');
  const [demandDesc, setDemandDesc] = useState('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentOffer, setPaymentOffer] = useState<any>(null); 

  const handleCustomerGPS = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const data = await res.json();
          const detected = (data.address.suburb || data.address.neighbourhood || data.address.city || data.address.state_district || 'Borivali');
          
          const matchedBazaar = LOCAL_BAZAARS.find(b => detected.toLowerCase().includes(b.toLowerCase()));
          const matchedDistrict = MAHARASHTRA_DISTRICTS.find(d => detected.toLowerCase().includes(d.toLowerCase()));
          const matched = matchedBazaar || matchedDistrict || 'Borivali';
          
          setSelectedLocation(matched);
          setDeliveryDistrict(matched);
        } catch (err) {}
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoadingPrices(true);
    fetchMarketPrices(selectedLocation).then((data) => {
      if (isMounted) {
        setCommodities(data || []);
        setIsLoadingPrices(false);
      }
    });
    return () => { isMounted = false; };
  }, [selectedLocation]);

  const fetchData = async () => {
    try {
      const resProducts = await fetch(`${API_BASE}/listings/?t=${Date.now()}`);
      const dataProducts = await resProducts.json();
      if (dataProducts.status === 'success') setProducts(dataProducts.data || []);

      const resDeals = await fetch(`${API_BASE}/offers/?buyer=${currentUser}&t=${Date.now()}`);
      const dataDeals = await resDeals.json();
      if (dataDeals.status === 'success') setMyDeals(dataDeals.data || []);

      const resDemands = await fetch(`${API_BASE}/demands/?t=${Date.now()}`);
      const dataDemands = await resDemands.json();
      if (dataDemands.status === 'success') {
        const userDemands = (dataDemands.data || []).filter((d: any) => d.buyer__username === currentUser);
        setMyDemands(userDemands);
      }
    } catch (err) {}
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    try {
      const res = await fetch(`${API_BASE}/offers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_username: currentUser,
          product_id: selectedProduct.id,
          proposed_price: offerPrice,
          quantity: offerQuantity,
          transport: transport
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSelectedProduct(null);
        setOfferPrice('');
        setOfferQuantity('');
        setShowSuccessModal(true);
        fetchData();
      } else {
        alert(data.message || "Failed to process the offer.");
      }
    } catch (err) {
      alert("Connection failed to the server.");
    }
  };

  const handlePostDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/demands/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_username: currentUser,
          crop_name: demandCrop,
          expected_price: demandPrice,
          quantity: demandQty,
          description: demandDesc
        })
      });
      if (res.ok) {
        alert("Requirement posted! Farmers can now see your demand.");
        setShowDemandModal(false);
        setDemandCrop(''); setDemandPrice(''); setDemandQty(''); setDemandDesc('');
        fetchData();
      }
    } catch (err) {}
  };

  const handleUpdateStatus = async (offerId: string, newStatus: string, newPrice?: string) => {
    const payload: any = { offer_id: offerId, status: newStatus };
    if (newPrice) payload.proposed_price = newPrice;

    const res = await fetch(`${API_BASE}/offers/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) fetchData();
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/offers/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offer_id: paymentOffer.id, status: 'Escrow Funded' })
        });
        if (res.ok) {
          setPaymentOffer(null);
          fetchData();
        }
      } catch (err) {}
      setIsProcessingPayment(false);
    }, 1500);
  };

  const displayedCommodities = commodities.filter(item => 
    (item.commodity || '').toLowerCase().includes(marketSearchTerm.toLowerCase()) ||
    (item.market || '').toLowerCase().includes(marketSearchTerm.toLowerCase())
  );

  const displayedProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(marketSearchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 min-h-screen bg-slate-50 w-full px-4 sm:px-6 lg:px-12 mx-auto pb-16 relative">
      
      <h1 className="text-3xl md:text-4xl font-serif text-[#163020] tracking-tight mb-5">Marketplace</h1>
      
      {/* TOOLBAR */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 mb-8">
        
        <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 inline-flex overflow-x-auto w-full xl:w-auto shadow-sm">
          <button onClick={() => setActiveTab('market')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'market' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>Live Market Rates</button>
          <button onClick={() => setActiveTab('direct')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'direct' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>Buy from Farmer</button>
          <button onClick={() => setActiveTab('deals')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'deals' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>My Deals</button>
          <button onClick={() => setActiveTab('demands')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'demands' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>My Requirements</button>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          
          <div className="flex items-center bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm w-full sm:w-auto h-[44px]">
            <div className="flex items-center pl-2 pr-1">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <select 
              value={selectedLocation} 
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setDeliveryDistrict(e.target.value);
              }} 
              className="bg-transparent focus:outline-none cursor-pointer py-1 pr-1 font-bold text-slate-700 text-sm w-full sm:w-36 truncate appearance-none"
            >
              <optgroup label="📍 Mumbai Retail Bazaars">
                {LOCAL_BAZAARS.map(b => <option key={b} value={b}>{b} Bazaar</option>)}
              </optgroup>
              <optgroup label="🏢 Maharashtra Wholesale APMC">
                {MAHARASHTRA_DISTRICTS.map(d => <option key={d} value={d}>{d} APMC</option>)}
              </optgroup>
            </select>
            <div className="w-px h-5 bg-slate-200 mx-1 shrink-0"></div>
            <button 
              type="button" 
              onClick={handleCustomerGPS} 
              className="p-1.5 px-2 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 rounded-lg transition-colors flex items-center justify-center shrink-0"
              title="Detect GPS"
            >
              {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative w-full sm:w-60 h-[44px] shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search crops..." 
              value={marketSearchTerm} 
              onChange={(e) => setMarketSearchTerm(e.target.value)} 
              className="w-full h-full pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm placeholder:text-slate-400" 
            />
          </div>

          <button onClick={() => setShowDemandModal(true)} className="flex items-center justify-center gap-2 w-full sm:w-auto h-[44px] px-5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-sm shrink-0 transition-colors">
            <PlusCircle className="w-4 h-4" /> Post Requirement
          </button>

        </div>
      </div>

      {/* TABS */}
      {activeTab === 'market' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
          {isLoadingPrices ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
              <p className="text-sm text-slate-400 font-medium">Fetching real-time rates for {selectedLocation}...</p>
            </div>
          ) : displayedCommodities.map((item, idx) => (
            <CommodityCard key={item.id || idx} item={item} />
          ))}
        </div>
      )}

      {activeTab === 'direct' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in">
          {displayedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="h-48 relative">
                {/* DYNAMIC IMAGE OVERRIDE */}
                <img src={getImageForCrop(product.name)} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 backdrop-blur-sm shadow-sm">Farmer: {product.farmerId}</div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-slate-800">{product.name}</h3>
                  <p className="text-lg font-bold text-emerald-600">₹{product.price}<span className="text-xs text-slate-400">/kg</span></p>
                </div>
                <div className="flex items-center gap-4 mb-5 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {product.location || 'Maharashtra'}</span>
                  <span className="flex items-center gap-1.5"><Package className="w-4 h-4" /> {product.stock || 0} kg</span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedProduct(product);
                    setDeliveryDistrict(selectedLocation);
                  }} 
                  className="w-full mt-auto py-3 bg-[#163020] hover:bg-emerald-950 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Handshake className="w-4 h-4" /> Negotiate Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPGRADED REQUIREMENTS UI */}
      {activeTab === 'demands' && (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in">
          {myDemands.length === 0 ? (
            <div className="py-20 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Megaphone className="w-16 h-16 mb-4 text-slate-300 mx-auto" />
              <p className="text-xl font-bold text-slate-800 mb-2">No Requirements Posted</p>
              <p className="text-sm">Post a requirement to receive direct bids from local farmers.</p>
            </div>
          ) : myDemands.map(demand => (
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
                  </div>
                  
                  {demand.description && (
                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-sm text-slate-600 italic">
                      "{demand.description}"
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 min-w-[200px]">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center md:text-left">Market Status</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-700 font-bold bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        Open for Bids
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPGRADED DEALS UI */}
      {activeTab === 'deals' && (
        <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in">
          {myDeals.length === 0 ? (
            <div className="py-20 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <ReceiptText className="w-16 h-16 mb-4 text-slate-300 mx-auto" />
              <p className="text-xl font-bold text-slate-800">No deals yet</p>
            </div>
          ) : myDeals.map(deal => (
            <div key={deal.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
              
              {/* DYNAMIC IMAGE OVERRIDE */}
              <img src={getImageForCrop(deal.productName)} alt={deal.productName} className="w-24 h-24 rounded-xl object-cover shrink-0 shadow-sm border border-slate-100" />
              
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-xl text-slate-800">{deal.productName}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Farmer: <span className="font-semibold text-slate-700">{deal.farmerId}</span></p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                    deal.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    deal.status === 'Escrow Funded' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    deal.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    deal.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {deal.status}
                  </span>
                </div>
                
                {/* UPGRADED FONT SIZES HERE */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="min-w-[80px]">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Rate</p>
                    <p className="font-bold text-slate-800 text-base">₹{deal.proposedPrice}<span className="text-xs text-slate-500">/kg</span></p>
                  </div>
                  <div className="w-px bg-slate-200 mx-2 hidden sm:block"></div>
                  <div className="min-w-[80px]">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Quantity</p>
                    <p className="font-bold text-slate-800 text-base">{deal.quantity} <span className="text-xs text-slate-500">kg</span></p>
                  </div>
                  <div className="w-px bg-slate-200 mx-2 hidden sm:block"></div>
                  <div className="min-w-[80px]">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Value</p>
                    <p className="font-black text-emerald-700 text-lg">₹{(deal.proposedPrice * deal.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                {deal.status === 'Countered' && (
                  <>
                    <button onClick={() => handleUpdateStatus(deal.id, 'Accepted')} className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-sm hover:bg-emerald-700 transition-colors">Accept</button>
                    <button onClick={() => { setBuyerCounterModal(deal); setBuyerCounterPrice(''); }} className="px-5 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl text-sm border border-blue-200 hover:bg-blue-100 transition-colors">Counter</button>
                  </>
                )}
                {deal.status === 'Accepted' && (
                  <button onClick={() => setPaymentOffer(deal)} className="px-6 py-3 bg-[#0b5c43] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-900 transition-colors">
                    <ShieldCheck className="w-4 h-4"/> Fund Escrow
                  </button>
                )}
                {deal.status === 'In Transit' && (
                  <button onClick={() => handleUpdateStatus(deal.id, 'Completed')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition-colors">
                    <CheckCircle2 className="w-4 h-4"/> Confirm Delivery
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {showDemandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Post a Requirement</h2>
            <form onSubmit={handlePostDemand} className="space-y-4">
              <input type="text" required placeholder="Crop Name (e.g. Dragon Fruit)" value={demandCrop} onChange={(e) => setDemandCrop(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" required placeholder="Target ₹/kg" value={demandPrice} onChange={(e) => setDemandPrice(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                <input type="number" required placeholder="Quantity (kg)" value={demandQty} onChange={(e) => setDemandQty(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <textarea placeholder="Specific notes (e.g. Needs to be grade A quality)" value={demandDesc} onChange={(e) => setDemandDesc(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium h-24 resize-none focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowDemandModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-md">Post Demand</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Make an Offer</h2>
            <p className="text-xs text-slate-500 mb-4">Direct offer to {selectedProduct.farmerId} for {selectedProduct.name}</p>
            <form onSubmit={handleSubmitOffer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="number" required placeholder={`Rate (₹/kg)`} value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                <input type="number" required placeholder={`Qty (kg)`} value={offerQuantity} onChange={(e) => setOfferQuantity(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Delivery Destination</label>
                <select value={deliveryDistrict} onChange={(e) => setDeliveryDistrict(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700">
                  <optgroup label="📍 Mumbai Retail Bazaars">
                    {LOCAL_BAZAARS.map(b => <option key={b} value={b}>{b} Bazaar</option>)}
                  </optgroup>
                  <optgroup label="🏢 Maharashtra Wholesale APMC">
                    {MAHARASHTRA_DISTRICTS.map(d => <option key={d} value={d}>{d} APMC</option>)}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Logistics</label>
                <select value={transport} onChange={(e) => setTransport(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700">
                  <option value="Trade by our Third Party Logistics">Trade by our Third Party Logistics</option>
                  <option value="Buyer Arranges Transport">Buyer Arranges Transport</option>
                  <option value="Farmer Delivery">Farmer Delivery</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setSelectedProduct(null)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-md">Send Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {paymentOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-emerald-600"/> Secure Escrow</h2>
            <div className="bg-emerald-50 p-5 rounded-2xl my-5 flex justify-between items-center border border-emerald-100">
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Total Escrow Value</p>
                <p className="text-3xl font-black text-emerald-700">₹{(paymentOffer.proposedPrice * paymentOffer.quantity).toLocaleString()}</p>
              </div>
              <ShieldCheck className="w-10 h-10 text-emerald-400" />
            </div>
            <form onSubmit={handleProcessPayment} className="space-y-4">
              <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm font-bold text-slate-700">UPI / Google Pay / PhonePe</span>
              </label>
              <button disabled={isProcessingPayment} type="submit" className="w-full py-4 mt-2 bg-[#0b5c43] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 hover:bg-emerald-900 transition-colors">
                {isProcessingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {isProcessingPayment ? 'Securing Funds...' : 'Lock Funds in Escrow'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Offer Submitted</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">The farmer has been notified. Track updates in your <b>My Deals</b> tab.</p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-3.5 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 shadow-md">Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}