import { useState } from 'react';

interface UseMutationAsyncOptions<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export function useMutationAsync<TArgs, TData, TError = Error>(
  mutationFn: (args: TArgs) => Promise<TData>,
  options?: UseMutationAsyncOptions<TData, TError>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<TError | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutateAsync = async (args: TArgs): Promise<TData> => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      const result = await mutationFn(args);
      setData(result);
      setIsSuccess(true);
      options?.onSuccess?.(result);
      return result;
    } catch (err: unknown) {
      const error = err as TError;
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutateAsync,
    isLoading,
    isSuccess,
    data,
    error,
  };
}
