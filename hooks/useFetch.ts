import { getRecords } from "@/util/zohoApi";
import { useState, useEffect } from "react";

interface FetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: (report_name: string, criteria_params: string) => Promise<void>;
}

interface UseFetch {
  (reportName: string, criteria: string): FetchResult<any>;
}

const useFetch: UseFetch = (reportName, criteria) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (report_name: string, criteria_params: string) => {
    setLoading(true);
    setData(null);
    setError(null);
    try {
      const query = new URLSearchParams({
        report_name,
        criteria_params,
      }).toString();
      const result = await fetch(`/api/zoho?${query}`);
      const response = await result.json();
      console.log("Response", response);
      if (response.response.code !== 3000) {
        setError(response?.response?.error?.message);
        return;
      }
      setData(response.response.data);
    } catch (err: any) {
      console.error("Error use fetch", err);
      setError(
        err?.response?.data?.message || err?.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(reportName, criteria);
  }, [reportName, criteria]);

  return { data, error, loading, refetch: fetchData };
};

export default useFetch;
