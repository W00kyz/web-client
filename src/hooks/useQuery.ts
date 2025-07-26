import { useState, useEffect } from 'react';

interface UseQueryOptions<TData, TError> {
  enabled?: boolean;
  retry?: number;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export function useQuery<TData, TError = Error>(
  key: string,
  fetchFn: () => Promise<TData>,
  options?: UseQueryOptions<TData, TError>
) {
  const { enabled = true, retry = 0, onSuccess, onError } = options || {};
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<TError | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    setAttempts(0);

    while (attempts < retry + 1) {
      try {
        const result = await fetchFn();
        setData(result);
        setIsSuccess(true);
        onSuccess?.(result);
        setIsLoading(false);
        break;
      } catch (err: unknown) {
        setAttempts((prev) => prev + 1);
        if (attempts >= retry) {
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
    if (enabled) fetchData();
  }, [key]);

  return {
    data,
    error,
    isLoading,
    isSuccess,
    refetch: fetchData,
  };
}
