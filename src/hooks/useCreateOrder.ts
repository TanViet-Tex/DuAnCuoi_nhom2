// src/hooks/useCreateOrder.ts

import { useState } from 'react';
import { createOrder, CreateOrderData, Order } from '../services/order.service';

interface UseCreateOrderResult {
  create: (data: CreateOrderData) => Promise<Order>;
  loading: boolean;
  error: Error | null;
  order: Order | null;
  reset: () => void;
}

/**
 * Hook to create an order
 */
export function useCreateOrder(): UseCreateOrderResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const create = async (data: CreateOrderData): Promise<Order> => {
    try {
      setLoading(true);
      setError(null);

      const result = await createOrder(data);
      setOrder(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create order');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOrder(null);
    setError(null);
    setLoading(false);
  };

  return {
    create,
    loading,
    error,
    order,
    reset
  };
}
