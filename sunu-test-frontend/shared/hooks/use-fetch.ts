import { useCallback, useEffect, useState } from "react";
import { fetchWrapper, RequestOptions } from "../services/ fetch-wrapper";

interface UseFetchState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface UseFetchResult<T> extends UseFetchState<T> {
  refetch: () => Promise<void>;
}

export function useFetch<T = unknown>(
  url: string,
  options: RequestOptions = {}
): UseFetchResult<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await fetchWrapper<T>(url, {
        method:"GET",
        ...options
      });
      setState({ data, error: null, loading: false });
    } catch (err: any) {
      setState({ data: null, error: err.message, loading: false });
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { ...state, refetch };
}