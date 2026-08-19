import React, { useState, useEffect } from 'react';
import { Search, MapPin, ArrowUpRight, ArrowDownRight, Minus as MinusIcon, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { fetchMarketPrices, CommodityData } from '../services/marketApi';

function CommodityCard({ item }: { item: CommodityData }) {
  const [selectedMarketIndex, setSelectedMarketIndex] = useState(0);
  const currentMarket = item.markets[selectedMarketIndex] || item.markets[0];

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow flex flex-col">
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
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Select Market Location</label>
          <select 
            value={selectedMarketIndex}
            onChange={(e) => setSelectedMarketIndex(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
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

export function CustomerPortal() {
  const [marketSearchTerm, setMarketSearchTerm] = useState('');
  const [commodities, setCommodities] = useState<CommodityData[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingPrices(true);
    fetchMarketPrices().then((data) => {
      if (isMounted) {
        setCommodities(data);
        setIsLoadingPrices(false);
      }
    });
    return () => { isMounted = false };
  }, []);

  const displayedCommodities = commodities.filter(item => 
    item.commodity.toLowerCase().includes(marketSearchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(marketSearchTerm.toLowerCase()) ||
    item.markets.some(m => m.market.toLowerCase().includes(marketSearchTerm.toLowerCase()))
  );

  return (
    <div className="pt-24 min-h-screen bg-slate-50 w-full px-6 lg:px-12 mx-auto pb-16 relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#163020] tracking-[-0.04em] mb-2 flex items-center gap-3">
            Live Market Prices
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </h1>
          <p className="text-slate-500 text-lg">Check real-time APMC mandi rates across different cities before you buy or sell.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search crop, category or city..." 
              value={marketSearchTerm}
              onChange={(e) => setMarketSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoadingPrices ? (
          // Loading Skeletons
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 h-[480px] flex items-center justify-center shadow-sm">
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-300 mb-2" />
                <span className="text-sm text-slate-400 font-medium">Fetching live prices...</span>
              </div>
            </div>
          ))
        ) : displayedCommodities.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Search className="w-16 h-16 mb-4 text-slate-300" />
            <p className="text-xl font-bold text-slate-800 mb-2">No market prices found</p>
            <p className="text-base text-slate-500">Try adjusting your search term.</p>
          </div>
        ) : (
          displayedCommodities.map((item) => (
            <CommodityCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
