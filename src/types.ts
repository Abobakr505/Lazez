export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  priceDouble?: number;
  priceSingle: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSize?: 'single' | 'double';
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  endDate?: Date;
}

