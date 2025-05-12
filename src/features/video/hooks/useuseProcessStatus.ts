import { useState, useEffect, useCallback } from 'react';
import { &#x27;/api/upload&#x27; } from '../api';
import type { Video } from '../types';

interface UseUseprocessstatusReturn {
  data: Video | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUseprocessstatus(initialData?: Video): UseUseprocessstatusReturn {
  const [data, setData] = useState<Video | null>(initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(&#x27;/api/upload&#x27;);
      if (!response.ok) throw new Error(response.statusText);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData
      };
}