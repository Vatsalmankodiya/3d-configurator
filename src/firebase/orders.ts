import { db, isFirebaseConfigured } from './config';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { Order } from '../types/order';

export async function createOrder(order: Omit<Order, 'id'>): Promise<string> {
  const orderId = `ORD-${Date.now()}`;
  const completeOrder: Order = {
    ...order,
    id: orderId
  };

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'orders', orderId), completeOrder);
    } catch (err) {
      console.warn('Failed to save order to Firestore:', err);
    }
  }

  // Also cache in localStorage for instant order tracking
  const localOrders = JSON.parse(localStorage.getItem('apexgolf_orders') || '[]');
  localStorage.setItem('apexgolf_orders', JSON.stringify([completeOrder, ...localOrders]));

  return orderId;
}

export function getLocalOrders(): Order[] {
  return JSON.parse(localStorage.getItem('apexgolf_orders') || '[]');
}
