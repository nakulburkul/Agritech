import React, { useState, useEffect } from 'react';
import { Search, MapPin, ArrowUpRight, ArrowDownRight, Minus as MinusIcon, Loader2, Navigation, Package, Handshake, PlusCircle, CheckCircle2, CreditCard, QrCode, ReceiptText, Clock, XCircle, AlertTriangle, Truck, X, Megaphone, Leaf, ShieldCheck, Globe2 } from 'lucide-react';
import { fetchMarketPrices, LOCAL_BAZAARS, MAHARASHTRA_DISTRICTS } from '../services/marketApi';

const API_BASE = `http://${window.location.hostname}:8000/api`;

// ==========================================
// LIGHTWEIGHT MULTILINGUAL DICTIONARY
// ==========================================
const dict = {
  en: {
    market: "Live Market Rates", direct: "Buy from Farmer", deals: "My Deals", demands: "My Requirements",
    search: "Search crops...", postReq: "Post Requirement",
    modalRate: "Modal Rate", minRate: "Min Rate", maxRate: "Max Rate",
    farmer: "Farmer", negotiate: "Negotiate Deal",
    activeTicket: "Active Demand Ticket", postedOn: "Posted on", targetPrice: "Target Price",
    reqQty: "Required Quantity", buyer: "Buyer", marketStatus: "Market Status", openBids: "Open for Bids",
    fulfillCoop: "Fulfill via Co-op", sendDirect: "Send Direct Offer",
    rate: "Rate", qty: "Quantity", totalValue: "Total Value",
    accept: "Accept", counter: "Counter", decline: "Decline", fundEscrow: "Fund Escrow", confirmDel: "Confirm Delivery",
    noDeals: "No deals yet", noReqs: "No Requirements Posted", postReqSub: "Post a requirement to receive direct bids from local farmers.",
    noOffers: "No Offers Yet"
  },
  hi: {
    market: "लाइव बाज़ार दरें", direct: "किसान से खरीदें", deals: "मेरे सौदे", demands: "मेरी आवश्यकताएं",
    search: "फसलें खोजें...", postReq: "आवश्यकता पोस्ट करें",
    modalRate: "औसत दर", minRate: "न्यूनतम दर", maxRate: "अधिकतम दर",
    farmer: "किसान", negotiate: "सौदा तय करें",
    activeTicket: "सक्रिय मांग टिकट", postedOn: "पोस्ट किया गया", targetPrice: "लक्षित मूल्य",
    reqQty: "आवश्यक मात्रा", buyer: "खरीदार", marketStatus: "बाज़ार की स्थिति", openBids: "बोलियों के लिए खुला",
    fulfillCoop: "सहकारी समिति द्वारा पूरा करें", sendDirect: "सीधा प्रस्ताव भेजें",
    rate: "दर", qty: "मात्रा", totalValue: "कुल मूल्य",
    accept: "स्वीकार करें", counter: "जवाबी प्रस्ताव", decline: "अस्वीकार करें", fundEscrow: "एस्क्रो फंड", confirmDel: "वितरण की पुष्टि करें",
    noDeals: "अभी तक कोई सौदा नहीं", noReqs: "कोई आवश्यकता पोस्ट नहीं की गई", postReqSub: "स्थानीय किसानों से सीधी बोलियां प्राप्त करने के लिए आवश्यकता पोस्ट करें।",
    noOffers: "अभी तक कोई प्रस्ताव नहीं"
  },
  mr: {
    market: "थेट बाजार भाव", direct: "शेतकऱ्याकडून खरेदी करा", deals: "माझे व्यवहार", demands: "माझ्या गरजा",
    search: "पिके शोधा...", postReq: "गरज पोस्ट करा",
    modalRate: "सरासरी दर", minRate: "किमान दर", maxRate: "कमाल दर",
    farmer: "शेतकरी", negotiate: "व्यवहार ठरवा",
    activeTicket: "सक्रिय मागणी तिकीट", postedOn: "रोजी पोस्ट केले", targetPrice: "लक्ष्य किंमत",
    reqQty: "आवश्यक प्रमाण", buyer: "खरेदीदार", marketStatus: "बाजाराची स्थिती", openBids: "बोलीसाठी खुले",
    fulfillCoop: "सहकारी गटामार्फत पूर्ण करा", sendDirect: "थेट प्रस्ताव पाठवा",
    rate: "दर", qty: "प्रमाण", totalValue: "एकूण मूल्य",
    accept: "स्वीकारा", counter: "प्रति-प्रस्ताव", decline: "नाकारा", fundEscrow: "एस्क्रो फंड", confirmDel: "वितरणाची पुष्टी करा",
    noDeals: "अद्याप कोणतेही व्यवहार नाहीत", noReqs: "कोणतीही गरज पोस्ट केलेली नाही", postReqSub: "स्थानिक शेतकऱ्यांकडून थेट बोली मिळवण्यासाठी गरज पोस्ट करा.",
    noOffers: "अद्याप कोणतेही प्रस्ताव नाहीत"
  }
};

// ==========================================
// SMART IMAGE ROUTER FOR ENTIRE CATALOG
// ==========================================
export const getImageForCrop = (cropName: string) => {
  const name = (cropName || '').toLowerCase();
  
  if (name.includes('tomato')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80';
  if (name.includes('onion') || name.includes('kanda')) return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&q=80';
  if (name.includes('potato') || name.includes('batata')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80';
  if (name.includes('bhindi') || name.includes('lady')) return 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=500&q=80';
  if (name.includes('chilli') || name.includes('mirch')) return 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&q=80';
  if (name.includes('cauliflower') || name.includes('gobi')) return 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&q=80';
  if (name.includes('cabbage')) return 'https://images.unsplash.com/photo-1559842603-91122a27572d?w=500&q=80';
  if (name.includes('capsicum')) return 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80';
  if (name.includes('brinjal') || name.includes('baingan')) return 'https://images.unsplash.com/photo-1601646876615-b52b2fcd1eb0?w=500&q=80';
  if (name.includes('bitter') || name.includes('karela')) return 'https://images.unsplash.com/photo-1594966601449-3ea595d24b7a?w=500&q=80';
  if (name.includes('bottle') || name.includes('lauki')) return 'https://images.unsplash.com/photo-1606180373809-5a8286a07cf0?w=500&q=80';
  if (name.includes('ridge') || name.includes('turai')) return 'https://images.unsplash.com/photo-1633519391090-e5559bd6c01e?w=500&q=80';
  if (name.includes('cucumber') || name.includes('kakdi')) return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80';
  if (name.includes('carrot')) return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80';
  if (name.includes('beetroot')) return 'https://images.unsplash.com/photo-1598144743282-3e2849e771e8?w=500&q=80';
  if (name.includes('peas') || name.includes('matar')) return 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&q=80';
  
  if (name.includes('coriander') || name.includes('kothmir')) return 'https://images.unsplash.com/photo-1592417817098-8f3d69104a47?w=500&q=80';
  if (name.includes('spinach') || name.includes('palak')) return 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80';
  if (name.includes('methi')) return 'https://images.unsplash.com/photo-1627844642677-9b422a2b0eb1?w=500&q=80';
  if (name.includes('ginger') || name.includes('adrak')) return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80';
  if (name.includes('garlic')) return 'https://images.unsplash.com/photo-1540148426941-de5d57b2803b?w=500&q=80';
  
  if (name.includes('lemon') || name.includes('nimbu')) return 'https://images.unsplash.com/photo-1590502593747-422e088a87ee?w=500&q=80';
  if (name.includes('dragon') || name.includes('dragonfruit')) return 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=500&q=80';
  if (name.includes('apple')) return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=500&q=80';
  if (name.includes('mango')) return 'https://images.unsplash.com/photo-1553279768-865429fd01a5?w=500&q=80';
  
  if (name.includes('wheat')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80';
  if (name.includes('soya')) return 'https://images.unsplash.com/photo-1599814880998-132d75f284b3?w=500&q=80';
  if (name.includes('cotton')) return 'https://images.unsplash.com/photo-1585864197775-685baf34f40f?w=500&q=80';
  if (name.includes('corn') || name.includes('maize')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&q=80';
  if (name.includes('rice') || name.includes('paddy')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80';
  
  if (name.includes('fruit')) return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80';
  return 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&q=80';
};

export function CustomerPortal() {
  const currentUser = localStorage.getItem('username') || '';

  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>('en');
  const t = dict[lang];

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

    // 150KG INTER-DISTRICT RULE LOGIC (Excludes intra-Mumbai transfers)
    const MUMBAI_SUBURBS = ['borivali', 'kandivali', 'malad', 'dahisar', 'andheri', 'mumbai'];
    const fLoc = String(selectedProduct.location || '').toLowerCase();
    const bLoc = String(deliveryDistrict || '').toLowerCase();
    
    const isFarmerMumbai = MUMBAI_SUBURBS.some(suburb => fLoc.includes(suburb));
    const isBuyerMumbai = MUMBAI_SUBURBS.some(suburb => bLoc.includes(suburb));
    
    let isInterDistrict = false;
    if (isFarmerMumbai && isBuyerMumbai) {
        isInterDistrict = false; // Both in Mumbai, no limit.
    } else if (!fLoc.includes(bLoc) && !bLoc.includes(fLoc)) {
        isInterDistrict = true; // Different locations, limit applies.
    }

    if (isInterDistrict && parseInt(offerQuantity, 10) < 150) {
        alert(`INTER-DISTRICT RULE:\nMinimum 150kg required for transport between ${selectedProduct.location} and ${deliveryDistrict}.`);
        return;
    }
    
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

  const submitBuyerCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (buyerCounterModal && buyerCounterPrice && !isNaN(Number(buyerCounterPrice))) {
      await handleUpdateStatus(buyerCounterModal.id, 'Pending', buyerCounterPrice);
      setBuyerCounterModal(null);
      setBuyerCounterPrice('');
    }
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
      
      {/* HEADER ROW */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl md:text-4xl font-serif text-[#163020] tracking-tight">Marketplace</h1>
        
        {/* MULTILINGUAL SELECTOR */}
        <div className="flex items-center bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
            <Globe2 className="w-4 h-4 text-emerald-600 mr-2" />
            <select value={lang} onChange={(e: any) => setLang(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none cursor-pointer">
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
            </select>
        </div>
      </div>
      
      {/* TOOLBAR */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 mb-8">
        
        <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 inline-flex overflow-x-auto w-full xl:w-auto shadow-sm">
          <button onClick={() => setActiveTab('market')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'market' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>{t.market}</button>
          <button onClick={() => setActiveTab('direct')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'direct' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>{t.direct}</button>
          <button onClick={() => setActiveTab('deals')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'deals' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>{t.deals}</button>
          <button onClick={() => setActiveTab('demands')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'demands' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>{t.demands}</button>
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
              placeholder={t.search} 
              value={marketSearchTerm} 
              onChange={(e) => setMarketSearchTerm(e.target.value)} 
              className="w-full h-full pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm placeholder:text-slate-400" 
            />
          </div>

          <button onClick={() => setShowDemandModal(true)} className="flex items-center justify-center gap-2 w-full sm:w-auto h-[44px] px-5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-sm shrink-0 transition-colors">
            <PlusCircle className="w-4 h-4" /> {t.postReq}
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
            <div key={item.id || idx} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
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
                  <p className="text-xs text-slate-400 font-semibold uppercase">{t.modalRate}</p>
                  <p className="text-3xl font-black text-emerald-700 tracking-tight">
                    ₹{item.modal_price || 0}
                    <span className="text-sm font-normal text-slate-500"> / {item.unit || 'kg'}</span>
                  </p>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-auto text-xs">
                  <div>
                    <p className="text-slate-400">{t.minRate}</p>
                    <p className="font-bold text-slate-700">₹{item.min_price || 0}/{item.unit || 'kg'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">{t.maxRate}</p>
                    <p className="font-bold text-slate-700">₹{item.max_price || 0}/{item.unit || 'kg'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'direct' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in">
          {displayedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="h-48 relative">
                {/* DYNAMIC SMART IMAGE */}
                <img src={getImageForCrop(product.name)} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 backdrop-blur-sm shadow-sm">{t.farmer}: {product.farmerId}</div>
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
                  <Handshake className="w-4 h-4" /> {t.negotiate}
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
              <p className="text-xl font-bold text-slate-800 mb-2">{t.noReqs}</p>
              <p className="text-sm">{t.postReqSub}</p>
            </div>
          ) : myDemands.map(demand => (
            <div key={demand.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow">
              <div className="w-full md:w-2 bg-emerald-500 h-2 md:h-auto shrink-0"></div>
              
              <div className="p-6 flex-1 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">{t.activeTicket}</span>
                    <span className="text-xs font-semibold text-slate-400">{t.postedOn} {new Date(demand.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{demand.crop_name}</h3>
                  
                  <div className="flex flex-wrap gap-6 mb-4">
                    <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.targetPrice}</p>
                      <p className="font-black text-emerald-700 text-lg">₹{demand.expected_price}<span className="text-sm font-medium text-slate-500">/kg</span></p>
                    </div>
                    <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.reqQty}</p>
                      <p className="font-bold text-slate-800 text-lg">{demand.quantity} <span className="text-sm font-medium text-slate-500">kg</span></p>
                    </div>
                    <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.buyer}</p>
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
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center md:text-left">{t.marketStatus}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-700 font-bold bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        {t.openBids}
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
              <p className="text-xl font-bold text-slate-800">{t.noDeals}</p>
            </div>
          ) : myDeals.map(deal => (
            <div key={deal.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
              
              {/* DYNAMIC SMART IMAGE */}
              <img src={getImageForCrop(deal.productName)} alt={deal.productName} className="w-32 h-32 rounded-2xl object-cover shrink-0 shadow-sm border border-slate-100" />
              
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-2xl text-slate-800">{deal.productName}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{t.farmer}: <span className="font-semibold text-slate-700">{deal.farmerId}</span></p>
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
                
                {/* BIG BOLD FONT FOR DEALS */}
                <div className="flex flex-wrap gap-4 text-sm mt-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="min-w-[90px]">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t.rate}</p>
                    <p className="font-bold text-slate-800 text-lg">₹{deal.proposedPrice}<span className="text-xs text-slate-500 font-medium">/kg</span></p>
                  </div>
                  <div className="w-px bg-slate-200 mx-1 hidden sm:block"></div>
                  <div className="min-w-[90px]">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t.qty}</p>
                    <p className="font-bold text-slate-800 text-lg">{deal.quantity} <span className="text-xs text-slate-500 font-medium">kg</span></p>
                  </div>
                  <div className="w-px bg-slate-200 mx-1 hidden sm:block"></div>
                  <div className="min-w-[90px]">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t.totalValue}</p>
                    <p className="font-black text-emerald-700 text-xl">₹{(deal.proposedPrice * deal.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                {deal.status === 'Countered' && (
                  <>
                    <button onClick={() => handleUpdateStatus(deal.id, 'Accepted')} className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-sm hover:bg-emerald-700 transition-colors">{t.accept}</button>
                    <button onClick={() => { setBuyerCounterModal(deal); setBuyerCounterPrice(''); }} className="px-5 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl text-sm border border-blue-200 hover:bg-blue-100 transition-colors">{t.counter}</button>
                  </>
                )}
                {deal.status === 'Accepted' && (
                  <button onClick={() => setPaymentOffer(deal)} className="px-6 py-3 bg-[#0b5c43] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-900 transition-colors">
                    <ShieldCheck className="w-4 h-4"/> {t.fundEscrow}
                  </button>
                )}
                {deal.status === 'In Transit' && (
                  <button onClick={() => handleUpdateStatus(deal.id, 'Completed')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition-colors">
                    <CheckCircle2 className="w-4 h-4"/> {t.confirmDel}
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
            <h2 className="text-xl font-bold text-slate-800 mb-4">{t.postReq}</h2>
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

      {/* BUYER COUNTER OFFER MODAL */}
      {buyerCounterModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">{t.counter}</h2>
              <button onClick={() => setBuyerCounterModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
              <p className="text-sm text-blue-900 leading-relaxed">
                Farmer <strong className="font-bold text-blue-950">{buyerCounterModal.farmerId}</strong> proposed an offer of <strong className="font-black text-blue-950 text-base">₹{buyerCounterModal.proposedPrice}/kg</strong> for <strong>{buyerCounterModal.productName}</strong>.
              </p>
            </div>
            
            <form onSubmit={submitBuyerCounter} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Counter Asking Price (₹/kg)</label>
                <input 
                  type="number" required min="1" value={buyerCounterPrice} 
                  onChange={(e) => setBuyerCounterPrice(e.target.value)} 
                  placeholder="Enter counter price" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-lg font-bold text-slate-800" 
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setBuyerCounterModal(null)} className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-colors">Send Counter</button>
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