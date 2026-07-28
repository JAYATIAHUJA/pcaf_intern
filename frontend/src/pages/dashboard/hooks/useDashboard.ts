import { useState, useEffect } from 'react';
import { apiJson } from '../../../lib/api';

export interface DashboardData {
  selectedYear: string;
  availableYears: string[];
  totalFinancedEmissions: number;
  portfolioCoverage: number;
  avgDataQuality: number;
  pendingApprovals: number;
  assetClassBreakdown: Array<{ assetClass: string; emissions: number; loanCount: number }>;
  sectorBreakdown: Array<{ rank: number; sector: string; financedEmissions: number; pctTotal: number; avgDQ: number; yoyTrend: string }>;
  topExposuresHighest: Array<{ rank: number; loanId: string; borrowerName: string; sector: string; financedEmissions: number; dq: string; assetClass: string }>;
  topExposuresLowest: Array<{ rank: number; loanId: string; borrowerName: string; sector: string; financedEmissions: number; dq: string; assetClass: string }>;
  sectorHighest: Array<{ sector: string; emissions: number }>;
  sectorLowest: Array<{ sector: string; emissions: number }>;
  yearlyComparison: Array<{ assetClass: string; fy2023: number; fy2024: number; fy2025: number }>;
  yearlyTrend: Array<{ year: string; financedEmissions: number }>;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = (year = selectedYear) => {
    setLoading(true);
    setError(null);
    const path = year ? `/dashboard?year=${encodeURIComponent(year)}` : '/dashboard';
    apiJson<DashboardData>(path)
      .then(res => {
        setData(res);
        if (!selectedYear || selectedYear !== res.selectedYear) setSelectedYear(res.selectedYear);
      })
      .catch(err => {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to fetch dashboard data');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard(selectedYear);
  }, [selectedYear]);

  return { data, selectedYear, setSelectedYear, loading, error, refresh: fetchDashboard };
}
