import React, { useState, useEffect } from 'react';
import { Search, MapPin, ArrowUpRight, ArrowDownRight, Minus as MinusIcon, Loader2, Navigation, Package, Handshake, PlusCircle, CheckCircle2, CreditCard, QrCode, ReceiptText, Clock, XCircle } from 'lucide-react';
import { fetchMarketPrices, CommodityData, MAHARASHTRA_DISTRICTS } from '../services/marketApi';

// ==========================================
// COMPONENT 1: APMC CARD
// ==========================================
function CommodityCard({ item }: { item: CommodityData }) { 
  const [selectedMarketIndex, setSelectedMarketIndex] = useState(0);
  useEffect(() => setSelectedMarketIndex(0), [item]);

  const currentMarket = item.markets[selectedMarketIndex] || item.markets[0] || {
    market: 'Local Mandi', modal_price: 0, min_price: 0, max_price: 0, trend: 'stable', change: '0.0%'
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100 shrink-0">
        <img src={item.image} alt={item.commodity} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-wider z-10 shadow-sm">
          {item.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-2xl text-slate-800">{item.commodity}</h3>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${
            currentMarket.trend === 'up' ? 'bg-red-50 text-red-600' :
            currentMarket.trend === 'down' ? 'bg-emerald-50 text-emerald-600' :
            'bg-slate-100 text-slate-600'
          }`}>
            {currentMarket.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> :
             currentMarket.trend === 'down' ? <ArrowDownRight className="w-3.5 h-3.5" /> :
             <MinusIcon className="w-3.5 h-3.5" />}
            {currentMarket.change}
          </div>
        </div>

        <div className="mb-5 relative">
          <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Select Market Location
          </label>
          <select 
            value={selectedMarketIndex}
            onChange={(e) => setSelectedMarketIndex(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {item.markets.map((m, idx) => (
              <option key={idx} value={idx}>{m.market}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-5">
          <p className="text-sm text-slate-500 mb-1">Modal Price</p>
          <p className="text-4xl font-bold text-emerald-700 tracking-tight">₹{currentMarket.modal_price}<span className="text-base font-medium text-slate-400">/q</span></p>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
          <div>
            <p className="text-slate-400 text-xs mb-0.5">Min Price</p>
            <p className="font-semibold text-slate-700 text-sm">₹{currentMarket.min_price}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs mb-0.5">Max Price</p>
            <p className="font-semibold text-slate-700 text-sm">₹{currentMarket.max_price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 2: CUSTOMER PORTAL MAIN
// ==========================================
export function CustomerPortal() {
  const currentUser = localStorage.getItem('username') || '';

  const [activeTab, setActiveTab] = useState<'apmc' | 'direct' | 'deals'>('apmc');
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [marketSearchTerm, setMarketSearchTerm] = useState('');
  
  // Data States
  const [commodities, setCommodities] = useState<CommodityData[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [myDeals, setMyDeals] = useState<any[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // UI States
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerQuantity, setOfferQuantity] = useState('');
  const [transport, setTransport] = useState('Buyer Arranges Transport');
  
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentOffer, setPaymentOffer] = useState<any>(null); // Controls Payment Modal

  // 1. Fetch Data
  useEffect(() => {
    let isMounted = true;
    setIsLoadingPrices(true);
    fetchMarketPrices(selectedDistrict).then((data) => {
      if (isMounted) { setCommodities(data); setIsLoadingPrices(false); }
    });
    return () => { isMounted = false };
  }, [selectedDistrict]);

  const fetchData = async () => {
    try {
      // Fetch Farmer Listings
      const resProducts = await fetch('http://127.0.0.1:8000/api/listings/');
      const dataProducts = await resProducts.json();
      if (dataProducts.status === 'success') setProducts(dataProducts.data);

      // Fetch Customer's Deals
      const resDeals = await fetch(`http://127.0.0.1:8000/api/offers/?buyer=${currentUser}`);
      const dataDeals = await resDeals.json();
      if (dataDeals.status === 'success') setMyDeals(dataDeals.data);
    } catch (err) {
      console.error("Failed to load data.", err);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  // 2. Actions
  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/offers/', {
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
        setOfferPrice(''); setOfferQuantity('');
        setShowSuccessModal(true); // Trigger beautiful popup
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (err) { alert("API Connection Failed"); }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    
    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/offers/', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offer_id: paymentOffer.id, status: 'Paid' })
        });
        if (res.ok) {
          setPaymentOffer(null);
          fetchData(); // Refresh deals to show 'Paid' status
        }
      } catch (err) { alert("Payment Failed"); }
      setIsProcessingPayment(false);
    }, 2000);
  };

  // 3. Filters
  const displayedCommodities = commodities.filter(item => 
    item.commodity.toLowerCase().includes(marketSearchTerm.toLowerCase()) || 
    item.markets.some(m => m.market.toLowerCase().includes(marketSearchTerm.toLowerCase()))
  );
  const displayedProducts = products.filter(p => p.name.toLowerCase().includes(marketSearchTerm.toLowerCase()));

  return (
    <div className="pt-24 min-h-screen bg-slate-50 w-full px-6 lg:px-12 mx-auto pb-16 relative">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#163020] tracking-[-0.04em] mb-4">Marketplace</h1>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 inline-flex">
            <button onClick={() => setActiveTab('apmc')} className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'apmc' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Live APMC</button>
            <button onClick={() => setActiveTab('direct')} className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'direct' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Buy from Farmer</button>
            <button onClick={() => setActiveTab('deals')} className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'deals' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>My Deals</button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {activeTab === 'apmc' && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2.5 rounded-full text-sm font-semibold text-slate-700 shadow-sm">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="bg-transparent focus:outline-none cursor-pointer pr-2 font-bold text-slate-800">
                <option value="All">All Maharashtra</option>
                {MAHARASHTRA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}

          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search crops..." value={marketSearchTerm} onChange={(e) => setMarketSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
          </div>

          {activeTab === 'direct' && (
            <button onClick={() => setShowDemandModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-bold hover:bg-emerald-700 shadow-sm">
              <PlusCircle className="w-4 h-4" /> Post Requirement
            </button>
          )}
        </div>
      </div>

      {/* TABS RENDER */}
      {activeTab === 'apmc' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoadingPrices ? (
            <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
          ) : (
            displayedCommodities.map((item) => <CommodityCard key={item.id} item={item} />)
          )}
        </div>
      )}

      {activeTab === 'direct' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in">
          {displayedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="h-48 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 backdrop-blur-sm shadow-sm">Verified Farmer: {product.farmerId}</div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-slate-800">{product.name}</h3>
                  <p className="text-lg font-bold text-emerald-600">₹{product.price}<span className="text-xs text-slate-400">/kg</span></p>
                </div>
                <div className="flex items-center gap-4 mb-5 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {product.location}</span>
                  <span className="flex items-center gap-1.5"><Package className="w-4 h-4" /> {product.stock} kg avail.</span>
                </div>
                <button onClick={() => setSelectedProduct(product)} className="w-full mt-auto py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  <Handshake className="w-4 h-4" /> Negotiate Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'deals' && (
        <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in">
          {myDeals.length === 0 ? (
            <div className="py-20 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <ReceiptText className="w-16 h-16 mb-4 text-slate-300 mx-auto" />
              <p className="text-xl font-bold text-slate-800">No deals yet</p>
              <p>Make offers on the "Buy from Farmer" tab to see them here.</p>
            </div>
          ) : (
            myDeals.map(deal => (
              <div key={deal.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <img src={deal.image} alt={deal.productName} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{deal.productName}</h3>
                      <p className="text-sm text-slate-500">Farmer: {deal.farmerId}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                      deal.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      deal.status === 'Paid' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      deal.status === 'Declined' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {deal.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {deal.status === 'Accepted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {deal.status === 'Declined' && <XCircle className="w-3.5 h-3.5" />}
                      {deal.status === 'Paid' && <ReceiptText className="w-3.5 h-3.5" />}
                      {deal.status}
                    </span>
                  </div>
                  
                  <div className="flex gap-6 text-sm text-slate-600 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div><p className="text-[10px] uppercase font-bold text-slate-400">Offer Price</p><p className="font-bold">₹{deal.proposedPrice}/kg</p></div>
                    <div><p className="text-[10px] uppercase font-bold text-slate-400">Quantity</p><p className="font-bold">{deal.quantity} kg</p></div>
                    <div><p className="text-[10px] uppercase font-bold text-slate-400">Total Value</p><p className="font-bold text-emerald-700">₹{deal.proposedPrice * deal.quantity}</p></div>
                  </div>
                </div>
                
                {deal.status === 'Accepted' && (
                  <button onClick={() => setPaymentOffer(deal)} className="w-full md:w-auto px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-700">
                    Pay Now
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* MODALS */}

      {/* 1. Send Offer Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Make an Offer</h2>
            <p className="text-sm text-slate-500 mb-6">Propose a price for {selectedProduct.name}</p>
            <form onSubmit={handleSubmitOffer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Price (₹/kg)</label>
                  <input type="number" required value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder={`Asking: ₹${selectedProduct.price}`} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Quantity (kg)</label>
                  <input type="number" required max={selectedProduct.stock} value={offerQuantity} onChange={(e) => setOfferQuantity(e.target.value)} placeholder={`Max: ${selectedProduct.stock}`} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setSelectedProduct(null)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/30">Send Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Beautiful Success Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Offer Sent!</h3>
            <p className="text-slate-500 mb-8 text-sm">Your negotiation request has been forwarded to the farmer. Track its status in the <b>My Deals</b> tab.</p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95">
              Got it
            </button>
          </div>
        </div>
      )}

      {/* 3. Secure Payment Gateway Modal */}
      {paymentOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Secure Checkout</h2>
              <button onClick={() => setPaymentOffer(null)} className="text-slate-400 hover:text-slate-600 font-bold">X</button>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Total Amount</p>
                <p className="text-2xl font-bold text-emerald-700">₹{paymentOffer.proposedPrice * paymentOffer.quantity}</p>
              </div>
              <ReceiptText className="w-8 h-8 text-slate-300" />
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <label className="flex items-center gap-3 p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-emerald-600" />
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  <span className="font-bold text-slate-700">Credit / Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="radio" name="payment" className="w-4 h-4 text-emerald-600" />
                  <QrCode className="w-5 h-5 text-slate-400" />
                  <span className="font-bold text-slate-700">UPI (GPay, PhonePe)</span>
                </label>
              </div>
              
              <button disabled={isProcessingPayment} type="submit" className="w-full py-4 mt-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 flex justify-center items-center gap-2 shadow-lg disabled:opacity-70">
                {isProcessingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                {isProcessingPayment ? 'Processing...' : `Pay ₹${paymentOffer.proposedPrice * paymentOffer.quantity}`}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}