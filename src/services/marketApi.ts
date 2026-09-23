export interface MarketInfo {
  market: string;
  district: string;
  min_price: string | number;
  max_price: string | number;
  modal_price: string | number;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

export interface CommodityData {
  id: string;
  commodity: string;
  category: string;
  image: string;
  markets: MarketInfo[];
}

export const MAHARASHTRA_DISTRICTS = [
  "Ahmednagar", "Akola", "Amravati", "Chhatrapati Sambhajinagar", "Beed",
  "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli",
  "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur",
  "Latur", "Mumbai", "Mumbai Suburban", "Nagpur", "Nanded",
  "Nandurbar", "Nashik", "Dharashiv", "Palghar", "Parbhani",
  "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
  "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

const CROP_IMAGES: Record<string, string> = {
  'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
  'onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80',
  'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80',
  'wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80',
  'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
  'cotton': 'https://images.unsplash.com/photo-1505700207310-91402c0c326e?auto=format&fit=crop&w=400&q=80',
  'soybean': 'https://images.unsplash.com/photo-1599895055042-49162fdbf08b?auto=format&fit=crop&w=400&q=80',
  'sugarcane': 'https://images.unsplash.com/photo-1598006764516-7782161beaf2?auto=format&fit=crop&w=400&q=80',
  'pomegranate': 'https://images.unsplash.com/photo-1615486171448-4ca3f2402bc0?auto=format&fit=crop&w=400&q=80',
  'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80',
  'banana': 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?auto=format&fit=crop&w=400&q=80',
  'grapes': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=400&q=80',
  'tur': 'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=400&q=80',
  'orange': 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=400&q=80',
  'mousambi': 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=400&q=80',
  'beans': 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=400&q=80',
  'mataki': 'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=400&q=80',
  'pumpkin': 'https://images.unsplash.com/photo-1506917728037-b6fb041a4f34?auto=format&fit=crop&w=400&q=80',
  'cowpea': 'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=400&q=80',
  'default': 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=400&q=80',
};

function matchImage(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(CROP_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return CROP_IMAGES['default'];
}

export async function fetchMarketPrices(district = '', state = 'Maharashtra'): Promise<CommodityData[]> {
  try {
    let url = `http://127.0.0.1:8000/api/market-prices/?state=${state}`;
    if (district && district !== 'All') {
      url += `&district=${encodeURIComponent(district)}`;
    }

    const response = await fetch(url);
    const result = await response.json();
    const grouped: Record<string, CommodityData> = {};

    if (result.data && result.data.length > 0) {
      result.data.forEach((item: any, index: number) => {
        const rawName = item.commodity || 'Produce';
        const cleanMarket = item.market ? item.market.replace(/[()]/g, ' ').trim() : 'Mandi';
        const marketLabel = `${cleanMarket} Mandi, ${item.district || district}`;

        if (!grouped[rawName]) {
          grouped[rawName] = {
            id: `${rawName}-${index}`,
            commodity: rawName,
            category: item.variety || 'Agricultural Produce',
            image: matchImage(rawName),
            markets: [],
          };
        }

        // Add each unique mandi location found for this commodity in this district
        if (!grouped[rawName].markets.some(m => m.market === marketLabel)) {
          grouped[rawName].markets.push({
            market: marketLabel,
            district: item.district || district,
            min_price: item.min_price || item.modal_price,
            max_price: item.max_price || item.modal_price,
            modal_price: item.modal_price,
            trend: 'up',
            change: '+1.5%',
          });
        }
      });
    }

    return Object.values(grouped);
  } catch (error) {
    console.error('Error fetching market prices:', error);
    return [];
  }
}