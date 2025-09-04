import { useState, useEffect, useCallback } from 'react';

type QueryKey = string | unknown[];

interface QueryOptions<TData, TError> {
  enabled?: boolean;
  initialData?: TData;
  staleTime?: number;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  retry?: boolean | number;
}

interface QueryResult<TData, TError> {
  data: TData | undefined;
  error: TError | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

const queryCache = new Map<string, { data: unknown; timestamp: number }>();

function serializeQueryKey(key: QueryKey): string {
  return typeof key === 'string' ? key : JSON.stringify(key);
}

export function useQuery<TData, TError = Error>(
  key: QueryKey,
  queryFn: () => Promise<TData>,
  options: QueryOptions<TData, TError> = {}
): QueryResult<TData, TError> {
  const {
    enabled = true,
    initialData,
    staleTime = 0,
    onSuccess,
    onError,
    retry = 0,
  } = options;

  const cacheKey = serializeQueryKey(key);
  const cached = queryCache.get(cacheKey);

  const [data, setData] = useState<TData | undefined>(() => {
    if (cached && Date.now() - cached.timestamp < staleTime) {
      return cached.data as TData;
    }
    return initialData;
  });

  const [error, setError] = useState<TError | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsFetching(true);
    setIsLoading(!data);

    const maxAttempts = retry === true ? 3 : retry === false ? 1 : retry + 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await queryFn();
        setData(result);
        setError(null);
        queryCache.set(cacheKey, { data: result, timestamp: Date.now() });
        if (onSuccess) onSuccess(result);
        break;
      } catch (err) {
        const typedError = err as TError;
        setError(typedError);
        if (onError) onError(typedError);
      }
    }

    setIsFetching(false);
    setIsLoading(false);
  }, [cacheKey, queryFn, enabled, retry]); // **remove onSuccess/onError**

  useEffect(() => {
    if (!enabled) return;

    // Checa cache antes de buscar
    if (cached && Date.now() - cached.timestamp < staleTime) {
      setData(cached.data as TData);
      setIsLoading(false);
      return;
    }

    void fetchData();
  }, [cacheKey, enabled]); // só depende de key e enabled

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    isFetching,
    isError: error !== null,
    isSuccess: data !== undefined && error === null,
    refetch,
  };
}
