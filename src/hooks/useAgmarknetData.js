import { useState, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_AGMARK_API_KEY;
const BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

const useAgmarknetData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (filters) => {
    setLoading(true);
    setError(null);

    const cacheKey = `agmarknet_data_${filters.state}_${filters.commodity}`;
    const cachedItem = localStorage.getItem(cacheKey);

    if (cachedItem) {
      const { timestamp, data } = JSON.parse(cachedItem);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setData(data);
        setLoading(false);
        return;
      }
    }

    try {
      const queryParams = new URLSearchParams({
        'api-key': API_KEY,
        format: 'json',
        limit: 100, // Fetch a reasonable number of recent records
      });

      if (filters.state) {
        queryParams.append('filters[state]', filters.state);
      }
      if (filters.commodity) {
        queryParams.append('filters[commodity]', filters.commodity);
      }

      const response = await fetch(`${BASE_URL}?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      const sortedRecords = result.records.sort((a, b) => new Date(b.arrival_date) - new Date(a.arrival_date));

      const cachePayload = {
        timestamp: Date.now(),
        data: sortedRecords,
      };

      localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
      setData(sortedRecords);

    } catch (err) {
      setError('Aaj ka taaza bhav abhi uplabdh nahi hai');
      // Fallback to cached data if API fails
      if (cachedItem) {
        const { data } = JSON.parse(cachedItem);
        setData(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};

export default useAgmarknetData;
