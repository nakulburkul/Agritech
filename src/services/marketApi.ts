export interface CommodityData {
  id?: string;
  market: string;
  commodity: string;
  variety?: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  unit?: string;
  image?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: string;
  category?: string;
  is_live_scraped?: boolean;
}

export const LOCAL_BAZAARS = ["Borivali", "Kandivali", "Malad", "Dahisar", "Andheri"];

export const MAHARASHTRA_DISTRICTS = [
  "Borivali", "Kandivali", "Malad", "Dahisar", "Andheri",
  "Ahilyanagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Chhatrapati Sambhajinagar", 
  "Dharashiv", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", 
  "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", 
  "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

const CROP_IMAGES: Record<string, { img: string; category: string }> = {
  'tomato': { img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80', category: 'Vegetables' },
  'onion': { img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&q=80', category: 'Vegetables' },
  'potato': { img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80', category: 'Vegetables' },
  'bhindi': { img: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=500&q=80', category: 'Vegetables' },
  'lady finger': { img: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=500&q=80', category: 'Vegetables' },
  'chilli': { img: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&q=80', category: 'Vegetables' },
  'gobi': { img: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&q=80', category: 'Vegetables' },
  'cauliflower': { img: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&q=80', category: 'Vegetables' },
  'kothmir': { img: 'https://images.unsplash.com/photo-1592417817098-8f3d69104a47?w=500&q=80', category: 'Herbs' },
  'coriander': { img: 'https://images.unsplash.com/photo-1592417817098-8f3d69104a47?w=500&q=80', category: 'Herbs' },
  'palak': { img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80', category: 'Greens' },
  'spinach': { img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80', category: 'Greens' },
  'ginger': { img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80', category: 'Spices' },
  'capsicum': { img: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80', category: 'Vegetables' },
  'matar': { img: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&q=80', category: 'Vegetables' }
};

export async function fetchMarketPrices(locationName: string = 'Borivali'): Promise<CommodityData[]> {
  try {
    const isLocal = LOCAL_BAZAARS.some(b => b.toLowerCase() === locationName.toLowerCase());
    const paramKey = isLocal ? 'suburb' : 'district';
    const type = isLocal ? 'bazaar' : 'apmc';
    
    const response = await fetch(`http://${window.location.hostname}:8000/api/market-prices/?${paramKey}=${encodeURIComponent(locationName)}&type=${type}`);
    const resData = await response.json();

    if (resData.status === 'success' && Array.isArray(resData.data)) {
      return resData.data.map((item: any, idx: number) => {
        const lowerName = (item.commodity || '').toLowerCase();
        const foundKey = Object.keys(CROP_IMAGES).find(k => lowerName.includes(k)) || 'tomato';
        
        return {
          id: `market-${idx}`,
          market: item.market || `${locationName} Bazaar`,
          commodity: item.commodity || 'Vegetable',
          variety: item.variety || 'Fresh Local',
          unit: item.unit || 'kg',
          min_price: item.min_price || 0,
          max_price: item.max_price || 0,
          modal_price: item.modal_price || 0,
          category: CROP_IMAGES[foundKey]?.category || 'Vegetables',
          image: CROP_IMAGES[foundKey]?.img || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80',
          trend: 'stable',
          change: item.is_live_scraped ? '● Live Scraped' : 'Retail Mandi',
          is_live_scraped: item.is_live_scraped
        };
      });
    }
    return [];
  } catch (err) {
    console.error("Market API error:", err);
    return [];
  }
}