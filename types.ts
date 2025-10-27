export interface ServiceItem {
  name: string;
  description: string;
  price: string;
  image: string;
  tags?: string[]; // e.g., 'الأكثر طلباً', 'متقدم', 'مخصص'
  timeline?: string;
  features?: string[];
}

export interface ServiceCategory {
  category: string;
  items: ServiceItem[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}