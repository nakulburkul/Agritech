import React, { createContext, useContext, useState } from 'react';

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  stock: number;
  status: string;
  farmerId: string;
  location: string;
};

export type Offer = {
  id: number;
  productId: number;
  productName: string;
  farmerId: string;
  buyerId: string;
  proposedPrice: number;
  quantity: number;
  message: string;
  transportArrangement: 'Buyer Pickup' | 'Seller Delivery';
  status: 'Pending' | 'Accepted' | 'Declined';
  date: string;
};

interface ShopContextType {
  products: Product[];
  offers: Offer[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'farmerId'>) => void;
  createOffer: (offer: Omit<Offer, 'id' | 'status' | 'date'>) => void;
  updateOfferStatus: (offerId: number, status: 'Accepted' | 'Declined') => void;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Fresh Organic Tomatoes', price: 60, category: 'Vegetables', rating: 4.8, stock: 450, status: 'Active', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&auto=format&fit=crop', farmerId: 'FRM-8291', location: 'Nashik, MH' },
  { id: 2, name: 'Premium Wheat', price: 35, category: 'Grains', rating: 4.9, stock: 1200, status: 'Active', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400&auto=format&fit=crop', farmerId: 'FRM-1044', location: 'Pune, MH' },
  { id: 3, name: 'Sweet Apples', price: 180, category: 'Fruits', rating: 4.7, stock: 300, status: 'Active', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=400&auto=format&fit=crop', farmerId: 'FRM-3321', location: 'Shimla, HP' },
  { id: 4, name: 'Organic Carrots', price: 50, category: 'Vegetables', rating: 4.6, stock: 200, status: 'Active', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=400&auto=format&fit=crop', farmerId: 'FRM-8291', location: 'Nashik, MH' },
  { id: 5, name: 'Fresh Strawberries', price: 400, category: 'Fruits', rating: 4.9, stock: 50, status: 'Active', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=400&auto=format&fit=crop', farmerId: 'FRM-5512', location: 'Mahabaleshwar, MH' },
  { id: 6, name: 'Golden Corn', price: 30, category: 'Grains', rating: 4.5, stock: 800, status: 'Active', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=400&auto=format&fit=crop', farmerId: 'FRM-9920', location: 'Aurangabad, MH' },
];

const INITIAL_OFFERS: Offer[] = [
  { id: 1, productId: 2, productName: 'Premium Wheat', farmerId: 'FRM-1044', buyerId: 'BYR-7721', proposedPrice: 33, quantity: 500, message: 'Looking to buy 500kg in bulk. Can you do ₹33/kg?', transportArrangement: 'Buyer Pickup', status: 'Pending', date: new Date().toISOString() }
];

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);

  const addProduct = (product: Omit<Product, 'id' | 'rating' | 'farmerId'>) => {
    setProducts(prev => [
      ...prev,
      { ...product, id: prev.length + 1, rating: 5.0, farmerId: 'FRM-1044' } // Assume logged in as FRM-1044
    ]);
  };

  const createOffer = (offer: Omit<Offer, 'id' | 'status' | 'date'>) => {
    setOffers(prev => [
      {
        ...offer,
        id: prev.length + 1,
        status: 'Pending',
        date: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const updateOfferStatus = (offerId: number, status: 'Accepted' | 'Declined') => {
    setOffers(prev => prev.map(offer => offer.id === offerId ? { ...offer, status } : offer));
  };

  return (
    <ShopContext.Provider value={{ products, offers, addProduct, createOffer, updateOfferStatus }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
