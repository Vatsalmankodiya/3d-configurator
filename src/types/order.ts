import { ProductConfiguration } from './configuration';

export interface CartItem {
  id: string; // unique item instance id
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  configuration: ProductConfiguration;
  thumbnailUrl: string;
  addedAt: string;
}

export interface OrderCustomerInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerInfo: OrderCustomerInfo;
  createdAt: string;
}
