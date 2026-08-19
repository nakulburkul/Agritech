import React, { useState } from 'react';
import { Package, IndianRupee, Sprout, TrendingUp, Plus, Activity, LayoutDashboard, Settings, User, X, Handshake, CheckCircle2, XCircle, Truck, MapPin, Bell, BarChart2, CloudSun, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop, Product, Offer } from '../context/ShopContext';

export function FarmerPortal() {
  const { products, offers, addProduct, updateOfferStatus } = useShop();
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Hardcoded for simulation matching the context
  const CURRENT_FARMER_ID = 'FRM-1044';
  
  // Filter offers for this farmer
  const myOffers = offers.filter(o => o.farmerId === CURRENT_FARMER_ID);
  const pendingOffersCount = myOffers.filter(o => o.status === 'Pending').length;
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [location, setLocation] = useState('Pune, MH');

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    let defaultImage = '';
    if (category === 'Vegetables') defaultImage = 'https://images.unsplash.com/photo-1595856728564-9842514110b6?q=80&w=400&auto=format&fit=crop';
    else if (category === 'Fruits') defaultImage = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400&auto=format&fit=crop';
    else defaultImage = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400&auto=format&fit=crop';

    addProduct({
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      category,
      status: 'Active',
      image: defaultImage,
      location: location
    });

    setIsAddingCrop(false);
    setName('');
    setPrice('');
    setStock('');
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
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('offers')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'offers' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <div className="flex items-center gap-3">
              <Handshake className="w-5 h-5" /> Offers
            </div>
            {pendingOffersCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingOffersCount}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('crops')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'crops' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Package className="w-5 h-5" /> My Listings
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'analytics' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Activity className="w-5 h-5" /> Analytics
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 lg:px-12 py-4 md:py-8 w-full max-w-4xl mx-auto">
        
        {/* Render standard header only if NOT on dashboard */}
        {activeTab !== 'dashboard' && (
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#163020] tracking-[-0.04em] mb-2">Seller Dashboard</h1>
              <p className="text-slate-500">Manage your listings and negotiate deals directly with buyers.</p>
            </div>
            
            <button 
              onClick={() => setIsAddingCrop(true)}
              className="px-5 py-2.5 bg-[#163020] text-white rounded-full font-bold shadow-md hover:bg-emerald-900 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Listing
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="w-full">
            {/* Green Header Section (Mobile App Style) */}
            <div className="bg-[#0b5c43] rounded-[2rem] p-6 md:p-8 text-white relative mb-16 overflow-hidden shadow-lg">
              <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-100 font-medium mb-0.5">Location</p>
                    <p className="font-bold flex items-center gap-1.5 text-lg"><MapPin className="w-4 h-4"/> Maharashtra, IN</p>
                  </div>
                </div>
                <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors shrink-0">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="h-20 md:h-24"></div> {/* Spacer for overlapping cards */}
            </div>

            {/* Overlapping Cards */}
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

            {/* AI Insights */}
            <div className="px-2">
              <h3 className="text-[#102a43] font-bold tracking-wider uppercase text-sm mb-5">AI Insights</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-[2rem] p-5 flex items-center gap-4 md:gap-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group">
                   <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                     <Sprout className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                     <h4 className="font-bold text-slate-800 text-base md:text-lg mb-0.5">Crop Predictor</h4>
                     <p className="text-xs md:text-sm text-slate-500">Analyze weather & soil for best yield</p>
                   </div>
                </div>

                <div className="bg-white rounded-[2rem] p-5 flex items-center gap-4 md:gap-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group">
                   <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                     <TrendingUp className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                     <h4 className="font-bold text-slate-800 text-base md:text-lg mb-0.5">Live Market Prices</h4>
                     <p className="text-xs md:text-sm text-slate-500">Track current rates in nearby cities</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fresh Red Onions"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Asking Price (₹ per kg)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Available Stock (kg)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                  <input 
                    type="text" 
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Pune, MH"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
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
