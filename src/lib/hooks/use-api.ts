import { useState, useEffect, useCallback } from "react";

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  meta: Record<string, any> | null;
  refetch: () => void;
}

export function useApi<T>(
  fetcher: () => Promise<{ success: boolean; data: T; meta?: any; error?: string }>,
  deps: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<Record<string, any> | null>(null);

  const fetcherRef = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      if (res.success) {
        setData(res.data);
        setMeta(res.meta ?? null);
      } else {
        setError(res.error || "请求失败");
      }
    } catch (err: any) {
      setError(err.message || "网络错误");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetcherRef();
  }, [fetcherRef]);

  return { data, loading, error, meta, refetch: fetcherRef };
}
