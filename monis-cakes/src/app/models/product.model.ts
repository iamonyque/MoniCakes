export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  available?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  stock?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'client';
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
}
