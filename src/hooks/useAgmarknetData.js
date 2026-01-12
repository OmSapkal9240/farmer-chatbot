import { useState, useCallback } from 'react';
import { AGMARK_API_KEY as FALLBACK_API_KEY } from '../config';

const envApiKey = import.meta.env.VITE_AGMARK_API_KEY;
const API_KEY = (envApiKey && envApiKey !== 'YOUR_AGMARK_API_KEY_HERE') ? envApiKey : FALLBACK_API_KEY;
const BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

const useAgmarknetData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    setLastUpdated('');

    const cacheKey = `agmarknet_data_${filters.state}_${filters.commodity}`;
    const cachedItem = localStorage.getItem(cacheKey);

    if (cachedItem) {
      const { timestamp, data: cachedData } = JSON.parse(cachedItem);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setData(cachedData);
        setLoading(false);
        if (cachedData.length > 0) {
          const mostRecentDate = new Date(cachedData[0].arrival_date);
          const today = new Date();
          if (mostRecentDate.toDateString() !== today.toDateString()) {
            setLastUpdated(`Aaj ka bhav uplabdh nahi hai, ${mostRecentDate.toLocaleDateString('en-IN')} ka data dikhaya ja raha hai.`);
          }
        }
        return;
      }
    }

    try {
      if (!API_KEY || API_KEY === 'YOUR_AGMARK_API_KEY_HERE') {
        throw new Error('API_KEY_MISSING');
      }

      const queryParams = new URLSearchParams({
        'api-key': API_KEY,
        format: 'json',
        limit: 500, // Fetch more records to get a better spread of mandis
      });

      if (filters.state) {
        queryParams.append('filters[state]', filters.state);
      }
      if (filters.commodity) {
        queryParams.append('filters[commodity]', filters.commodity);
      }

      const response = await fetch(`${BASE_URL}?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      const sortedRecords = result.records.sort((a, b) => new Date(b.arrival_date) - new Date(a.arrival_date));

      const cachePayload = {
        timestamp: Date.now(),
        data: sortedRecords,
      };

      localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
      setData(sortedRecords);

      if (sortedRecords.length > 0) {
        const mostRecentDate = new Date(sortedRecords[0].arrival_date);
        const today = new Date();
        if (mostRecentDate.toDateString() !== today.toDateString()) {
          setLastUpdated(`Aaj ka bhav uplabdh nahi hai, ${mostRecentDate.toLocaleDateString('en-IN')} ka data dikhaya ja raha hai.`);
        }
      }

    } catch (err) {
      setError(err.message);
      if (cachedItem) {
        const { data: cachedData } = JSON.parse(cachedItem);
        setData(cachedData);
        setLastUpdated('API se connect nahi ho pa raha. Purana data dikhaya ja raha hai.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, lastUpdated, fetchData };
};

export default useAgmarknetData;
