// --- Dashboard Data -----------------------------------------------------------
export const DASHBOARD_KPIS = {
  totalFinancedEmission: 268450,
  yoyChange: -8,
  portfolioCoverage: 82,
  waci: 245,
  avgDataQuality: 3.1,
};

export const ASSET_CLASS_EMISSION = [
  { assetClass: 'Business Loans & Unlisted Equity', financedEmissions: 188200, percentage: 70.10 },
  { assetClass: 'Commercial Real Estate', financedEmissions: 39500, percentage: 14.70 },
  { assetClass: 'Motor Vehicle Loans', financedEmissions: 20450, percentage: 7.60 },
  { assetClass: 'Mortgages', financedEmissions: 12300, percentage: 4.60 },
  { assetClass: 'Project Finance', financedEmissions: 5800, percentage: 2.20 },
  { assetClass: 'Others', financedEmissions: 2200, percentage: 0.80 },
];

export const SECTOR_EMISSIONS = [
  { rank: 1, sector: 'Manufacturing', financedEmissions: 112150, pctTotal: 41.80, avgDQ: 3.4, yoyTrend: '+6%' },
  { rank: 2, sector: 'Agriculture, Forestry & Fishing', financedEmissions: 62450, pctTotal: 23.30, avgDQ: 2.9, yoyTrend: '+4%' },
  { rank: 3, sector: 'Energy & Power', financedEmissions: 34800, pctTotal: 13.00, avgDQ: 2.3, yoyTrend: '+12%' },
  { rank: 4, sector: 'Transportation & Storage', financedEmissions: 24650, pctTotal: 9.20, avgDQ: 3.1, yoyTrend: 'Stable' },
  { rank: 5, sector: 'Wholesale & Retail Trade', financedEmissions: 17200, pctTotal: 6.40, avgDQ: 3.8, yoyTrend: '+8%' },
];

export const TOP10_HIGHEST = [
  { rank: 1, loanId: 'BL-KE-056', borrowerName: 'Rift Valley Steel Mills Ltd', sector: 'Manufacturing', financedEmissions: 14850, dq: 1, assetClass: 'Business Loans' },
  { rank: 2, loanId: 'BL-KE-089', borrowerName: 'Kenya Power Generation Ltd', sector: 'Energy & Power', financedEmissions: 12450, dq: 2, assetClass: 'Business Loans' },
  { rank: 3, loanId: 'BL-KE-112', borrowerName: 'Green Valley Tea Processing Ltd', sector: 'Agriculture, Forestry & Fishing', financedEmissions: 9780, dq: 2, assetClass: 'Business Loans' },
  { rank: 4, loanId: 'CRE-KE-034', borrowerName: 'Nairobi Industrial Park Ltd', sector: 'Construction & Real Estate', financedEmissions: 8920, dq: 2, assetClass: 'Commercial Real Estate' },
  { rank: 5, loanId: 'BL-KE-067', borrowerName: 'East Africa Cement Ltd', sector: 'Manufacturing', financedEmissions: 7850, dq: 1, assetClass: 'Business Loans' },
  { rank: 6, loanId: 'BL-KE-145', borrowerName: 'Mombasa Refinery Services', sector: 'Energy & Power', financedEmissions: 6820, dq: 3, assetClass: 'Business Loans' },
  { rank: 7, loanId: 'BL-KE-078', borrowerName: 'Lake Basin Sugar Mills', sector: 'Agriculture, Forestry & Fishing', financedEmissions: 5940, dq: 4, assetClass: 'Business Loans' },
  { rank: 8, loanId: 'CRE-KE-019', borrowerName: 'Horizon Logistics Hub Ltd', sector: 'Construction & Real Estate', financedEmissions: 5210, dq: 3, assetClass: 'Commercial Real Estate' },
  { rank: 9, loanId: 'MV-KE-142', borrowerName: 'ABC Heavy Fleet Ltd', sector: 'Transportation & Storage', financedEmissions: 4850, dq: 2, assetClass: 'Motor Vehicle Loans' },
  { rank: 10, loanId: 'BL-KE-203', borrowerName: 'Coastal Fertilizer Industries', sector: 'Manufacturing', financedEmissions: 4620, dq: 3, assetClass: 'Business Loans' },
];

export const TOP10_LOWEST = [
  { rank: 1, loanId: 'MV-KE-278', borrowerName: 'Alice Wanjiku', sector: 'Transportation & Storage', financedEmissions: 18, dq: 3, assetClass: 'Motor Vehicle Loans' },
  { rank: 2, loanId: 'MV-KE-315', borrowerName: 'Peter Kipchoge', sector: 'Transportation & Storage', financedEmissions: 24, dq: 2, assetClass: 'Motor Vehicle Loans' },
  { rank: 3, loanId: 'MV-KE-192', borrowerName: 'Jane Muthoni', sector: 'Transportation & Storage', financedEmissions: 31, dq: 3, assetClass: 'Motor Vehicle Loans' },
  { rank: 4, loanId: 'BL-KE-421', borrowerName: 'Solar Solutions Kenya Ltd', sector: 'Energy & Power', financedEmissions: 45, dq: 1, assetClass: 'Business Loans' },
  { rank: 5, loanId: 'MV-KE-267', borrowerName: 'David Otieno', sector: 'Transportation & Storage', financedEmissions: 52, dq: 4, assetClass: 'Motor Vehicle Loans' },
  { rank: 6, loanId: 'BL-KE-389', borrowerName: 'EcoClean Waste Management Ltd', sector: 'Wholesale & Retail Trade', financedEmissions: 68, dq: 2, assetClass: 'Business Loans' },
  { rank: 7, loanId: 'MV-KE-334', borrowerName: 'Mary Chelangat', sector: 'Transportation & Storage', financedEmissions: 75, dq: 3, assetClass: 'Motor Vehicle Loans' },
  { rank: 8, loanId: 'BL-KE-456', borrowerName: 'GreenTech IT Solutions Ltd', sector: 'Wholesale & Retail Trade', financedEmissions: 82, dq: 2, assetClass: 'Business Loans' },
  { rank: 9, loanId: 'MV-KE-289', borrowerName: 'Samuel Njoroge', sector: 'Transportation & Storage', financedEmissions: 89, dq: 3, assetClass: 'Motor Vehicle Loans' },
  { rank: 10, loanId: 'BL-KE-512', borrowerName: 'Kisumu Organic Farmers Coop', sector: 'Agriculture, Forestry & Fishing', financedEmissions: 95, dq: 4, assetClass: 'Business Loans' },
];

export const YEARLY_TREND = [
  { year: 'FY 2023', financedEmissions: 249800 },
  { year: 'FY 2024', financedEmissions: 278650 },
  { year: 'FY 2025', financedEmissions: 268450 },
];

export const YEARLY_COMPARISON = [
  { assetClass: 'Business Loans & Unlisted Equity', fy2023: 172500, fy2024: 198450, fy2025: 188200 },
  { assetClass: 'Commercial Real Estate', fy2023: 32800, fy2024: 41200, fy2025: 39500 },
  { assetClass: 'Motor Vehicle Loans', fy2023: 18250, fy2024: 22150, fy2025: 20450 },
  { assetClass: 'Mortgages', fy2023: 11200, fy2024: 13450, fy2025: 12300 },
];

export const SECTOR_HIGHEST = [
  { sector: 'Manufacturing', emissions: 27120 },
  { sector: 'Energy & Power', emissions: 19270 },
  { sector: 'Agriculture, Forestry & Fishing', emissions: 15720 },
  { sector: 'Construction & Real Estate', emissions: 14130 },
];

export const SECTOR_LOWEST = [
  { sector: 'Energy & Power', emissions: 45 },
  { sector: 'Agriculture, Forestry & Fishing', emissions: 95 },
  { sector: 'Wholesale & Retail Trade', emissions: 150 },
  { sector: 'Transportation & Storage', emissions: 289 },
];

export const DONUT_ASSET_COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#607D8B'];
export const DONUT_SECTOR_COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#607D8B'];

export function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n.toFixed(0)}`;
}
