export interface MarketPriceDetail {
  market: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

export interface CommodityData {
  id: string;
  commodity: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Cash Crops';
  image: string;
  markets: MarketPriceDetail[];
}

/**
 * Service to fetch market prices structured by commodity.
 * Built to integrate with a Django backend or a public agricultural API.
 */
export const fetchMarketPrices = async (): Promise<CommodityData[]> => {
  try {
    // -------------------------------------------------------------------------
    // TODO: Django API Integration
    // When your Django backend is ready, uncomment the following code and configure 
    // your environment variables (e.g., process.env.VITE_API_BASE_URL)
    // -------------------------------------------------------------------------
    
    // const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    // const response = await fetch(`${baseUrl}/market-prices`);
    // if (!response.ok) {
    //   throw new Error('Failed to fetch market prices from API');
    // }
    // return await response.json();

    // -------------------------------------------------------------------------
    // Simulated Backend Response
    // Provides realistic mock data for frontend development and preview
    // -------------------------------------------------------------------------
    return new Promise<CommodityData[]>((resolve) => {
      setTimeout(() => {
        const allData: CommodityData[] = [
          {
            id: 'c1',
            commodity: 'Onion',
            category: 'Vegetables',
            image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80',
            markets: [
              { market: 'Nashik APMC, MH', min_price: 1800, max_price: 2200, modal_price: 2000, trend: 'up', change: '+2.5%' },
              { market: 'Pune APMC, MH', min_price: 1900, max_price: 2300, modal_price: 2100, trend: 'up', change: '+1.2%' },
              { market: 'Lasalgaon APMC, MH', min_price: 1750, max_price: 2150, modal_price: 1950, trend: 'stable', change: '0.0%' }
            ]
          },
          {
            id: 'c2',
            commodity: 'Tomato',
            category: 'Vegetables',
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
            markets: [
              { market: 'Pune APMC, MH', min_price: 800, max_price: 1200, modal_price: 1000, trend: 'down', change: '-1.2%' },
              { market: 'Nashik APMC, MH', min_price: 750, max_price: 1100, modal_price: 900, trend: 'down', change: '-2.0%' },
              { market: 'Vashi APMC, MH', min_price: 850, max_price: 1300, modal_price: 1050, trend: 'stable', change: '0.0%' }
            ]
          },
          {
            id: 'c3',
            commodity: 'Potato',
            category: 'Vegetables',
            image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80',
            markets: [
              { market: 'Azadpur Mandi, DL', min_price: 1200, max_price: 1500, modal_price: 1350, trend: 'up', change: '+1.1%' },
              { market: 'Pune APMC, MH', min_price: 1300, max_price: 1600, modal_price: 1450, trend: 'up', change: '+0.5%' }
            ]
          },
          {
            id: 'c4',
            commodity: 'Garlic',
            category: 'Vegetables',
            image: 'https://images.unsplash.com/photo-1621317762694-8aa72c83c27e?w=400&q=80',
            markets: [
              { market: 'Pune APMC, MH', min_price: 8500, max_price: 9200, modal_price: 8800, trend: 'up', change: '+3.4%' },
              { market: 'Indore Mandi, MP', min_price: 8200, max_price: 9000, modal_price: 8600, trend: 'up', change: '+2.1%' }
            ]
          },
          {
            id: 'c5',
            commodity: 'Wheat',
            category: 'Grains',
            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
            markets: [
              { market: 'Azadpur Mandi, DL', min_price: 2200, max_price: 2400, modal_price: 2300, trend: 'up', change: '+0.8%' },
              { market: 'Bhopal Mandi, MP', min_price: 2150, max_price: 2350, modal_price: 2250, trend: 'stable', change: '0.0%' }
            ]
          },
          {
            id: 'c6',
            commodity: 'Soyabean',
            category: 'Grains',
            image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
            markets: [
              { market: 'Vashi APMC, MH', min_price: 4500, max_price: 4800, modal_price: 4650, trend: 'stable', change: '0.0%' },
              { market: 'Indore Mandi, MP', min_price: 4400, max_price: 4750, modal_price: 4600, trend: 'down', change: '-1.0%' }
            ]
          },
          {
            id: 'c7',
            commodity: 'Maize',
            category: 'Grains',
            image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80',
            markets: [
              { market: 'Nashik APMC, MH', min_price: 1900, max_price: 2100, modal_price: 2000, trend: 'down', change: '-0.5%' },
              { market: 'Jalgaon APMC, MH', min_price: 1850, max_price: 2050, modal_price: 1950, trend: 'down', change: '-0.8%' }
            ]
          },
          {
            id: 'c8',
            commodity: 'Cotton',
            category: 'Cash Crops',
            image: 'https://images.unsplash.com/photo-1589921601735-a681c6ee387d?w=400&q=80',
            markets: [
              { market: 'Nagpur APMC, MH', min_price: 6800, max_price: 7200, modal_price: 7000, trend: 'up', change: '+1.5%' },
              { market: 'Rajkot Mandi, GJ', min_price: 6900, max_price: 7300, modal_price: 7100, trend: 'up', change: '+1.8%' }
            ]
          },
          {
            id: 'c9',
            commodity: 'Apple',
            category: 'Fruits',
            image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80',
            markets: [
              { market: 'Shimla Mandi, HP', min_price: 4500, max_price: 5500, modal_price: 5000, trend: 'up', change: '+1.2%' },
              { market: 'Azadpur Mandi, DL', min_price: 4800, max_price: 6000, modal_price: 5400, trend: 'up', change: '+2.0%' },
              { market: 'Vashi APMC, MH', min_price: 5200, max_price: 6500, modal_price: 5800, trend: 'stable', change: '0.0%' }
            ]
          },
          {
            id: 'c10',
            commodity: 'Pomegranate',
            category: 'Fruits',
            image: 'https://images.unsplash.com/photo-1615486171437-0130fcc81b53?w=400&q=80',
            markets: [
              { market: 'Solapur APMC, MH', min_price: 6000, max_price: 8000, modal_price: 7000, trend: 'up', change: '+4.0%' },
              { market: 'Pune APMC, MH', min_price: 6500, max_price: 8500, modal_price: 7500, trend: 'up', change: '+3.5%' }
            ]
          }
        ];
        
        resolve(allData);
      }, 800);
    });
  } catch (error) {
    console.error("Error fetching market prices:", error);
    return [];
  }
};
