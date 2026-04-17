import { useCallback, useEffect, useState } from "react";
import { mockDemandes, type Demande } from "../data/mockDemandes";

export interface UseDemandesResult {
  data: Demande[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Simulated async loader that resolves to the mock list after a short delay.
 */
export function useDemandes(): UseDemandesResult {
  const [data, setData] = useState<Demande[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const t = setTimeout(() => {
      if (cancelled) return;
      setData(mockDemandes);
      setLoading(false);
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [tick]);

  return { data, loading, error, refetch };
}