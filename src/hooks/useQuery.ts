import { useState, useEffect, useRef } from 'react';

interface RefetchOptions {
  delay?: number;
  refetchOnWindowFocus?: boolean;
}

interface UseQueryOptions<TData, TError> {
  enabled?: boolean;
  retry?: number;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  refetchOptions?: RefetchOptions;
}

export function useQuery<TData, TError = Error>(
  key: string,
  fetchFn: () => Promise<TData>,
  options?: UseQueryOptions<TData, TError>
) {
  const {
    enabled = true,
    retry = 0,
    onSuccess,
    onError,
    refetchOptions = {},
  } = options || {};

  const { delay = 0, refetchOnWindowFocus = false } = refetchOptions;

  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<TError | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isSuccess, setIsSuccess] = useState(false);

  const mountedRef = useRef(true);

  const fetchData = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    let attempts = 0;

    while (attempts < retry + 1) {
      try {
        if (delay > 0) {
          await new Promise((res) => setTimeout(res, delay));
        }
        const result = await fetchFn();
        if (!mountedRef.current) return;
        setData(result);
        setIsSuccess(true);
        onSuccess?.(result);
        setIsLoading(false);
        break;
      } catch (err: unknown) {
        attempts++;
        if (attempts > retry) {
          if (!mountedRef.current) return;
          const error = err as TError;
          setError(error);
          onError?.(error);
          setIsLoading(false);
          break;
        }
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    if (enabled) fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [key]);

  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const onFocus = () => {
      fetchData();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refetchOnWindowFocus, key]);

  return {
    data,
    error,
    isLoading,
    isSuccess,
    refetch: fetchData,
  };
}
