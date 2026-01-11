// src/services/order.service.ts

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
  cancelledAt?: string;
}

export interface CreateOrderData {
  userId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
}

/**
 * Create a new order
 */
export async function createOrder(data: CreateOrderData): Promise<Order> {
  const response = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create order');
  }

  const result = await response.json();
  if (!result.order) {
    throw new Error('Invalid response format');
  }

  return result.order;
}

/**
 * Get all orders (admin)
 */
export async function getAllOrders(): Promise<Order[]> {
  const response = await fetch(`${API_BASE}/api/orders`);

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  const result = await response.json();
  return result.orders || [];
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const response = await fetch(`${API_BASE}/api/orders/user/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch user orders');
  }

  const orders: Order[] = await response.json();
  return orders;
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string): Promise<Order> {
  const response = await fetch(`${API_BASE}/api/orders/${orderId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Order not found');
    }
    throw new Error('Failed to fetch order');
  }

  const result = await response.json();
  if (!result.order) {
    throw new Error('Invalid response format');
  }

  return result.order;
}

/**
 * Update order status (admin)
 */
export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<Order> {
  const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update order');
  }

  const result = await response.json();
  if (!result.order) {
    throw new Error('Invalid response format');
  }

  return result.order;
}

/**
 * Cancel order
 */
export async function cancelOrder(
  orderId: string,
  userId: string,
  reason?: string
): Promise<Order> {
  const response = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, reason })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to cancel order');
  }

  const result = await response.json();
  return result.order;
}

/**
 * Request return
 */
export async function requestReturn(
  orderId: string,
  userId: string,
  reason: string,
  photos?: string[]
): Promise<Order> {
  const response = await fetch(`${API_BASE}/api/orders/${orderId}/return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, reason, photos })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to request return');
  }

  const result = await response.json();
  return result.order;
}
