// src/hooks/useOrders.ts

import { useState, useCallback } from 'react';
import { getAllOrders, getUserOrders, Order } from '../services/order.service';

interface UseOrdersOptions {
  userId?: string; // If provided, fetch user orders instead of all
}

interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch orders (all or by user)
 */
export function useOrders(options?: UseOrdersOptions): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Order[];
      if (options?.userId) {
        data = await getUserOrders(options.userId);
      } else {
        data = await getAllOrders();
      }

      setOrders(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [options?.userId]);

  // Auto-fetch on mount and when userId changes
  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders
  };
}
