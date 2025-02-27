"use client";

import { useEffect, useState } from "react";
import { fetchAnalytics } from "../../utils";

interface AnalyticsData {
  totalUsers: number;
  totalProperties: number;
  totalAgents: number;
  totalStudents: number;
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const analyticsData = await fetchAnalytics();
        setData(analyticsData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="analytics">
      <h4>Analytics</h4>
      <p>Total Users: {data?.totalUsers}</p>
      <p>Total Properties Listed: {data?.totalProperties}</p>
      <p>Total Agents: {data?.totalAgents}</p>
      <p>Total Students: {data?.totalStudents}</p>
    </div>
  );
};

export default Analytics;
