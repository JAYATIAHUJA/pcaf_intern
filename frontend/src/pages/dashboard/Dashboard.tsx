import React from 'react';
import { DONUT_ASSET_COLORS, DONUT_SECTOR_COLORS } from '../../constants/mockData';
import { Card, SectionTitle, Th, Td } from '../../components/ui';
import { DonutChart } from '../../components/charts/DonutChart';
import { HBar } from '../../components/charts/HBar';
import { useDashboard } from './hooks/useDashboard';
import { IconLayoutDashboard } from '@tabler/icons-react';

export default function Dashboard() {
  const { data, selectedYear, setSelectedYear, loading, error } = useDashboard();

  if (loading) {
    return (
      <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ fontSize: 16, color: '#64748b', fontWeight: 500 }}>Loading Dashboard KPIs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ fontSize: 16, color: '#ef4444', fontWeight: 500, marginBottom: 10 }}>Error: {error}</div>
        <div style={{ fontSize: 14, color: '#64748b' }}>Please verify that the backend API server is running and try again.</div>
      </div>
    );
  }

  const totalCapturedEmissions = data?.totalFinancedEmissions ?? 0;
  const displayBreakdown = data?.assetClassBreakdown ?? [];
  const sectorEmissions = data?.sectorBreakdown ?? [];
  const top10Highest = data?.topExposuresHighest ?? [];
  const top10Lowest = data?.topExposuresLowest ?? [];
  const sectorHighest = data?.sectorHighest ?? [];
  const sectorLowest = data?.sectorLowest ?? [];
  const yearlyComparison = data?.yearlyComparison ?? [];
  const yearlyTrend = data?.yearlyTrend ?? [];

  const maxYearly = Math.max(...yearlyComparison.map(r => Math.max(r.fy2023, r.fy2024, r.fy2025)), 1);
  const maxSector = Math.max(...sectorHighest.map(s => s.emissions), 1);
  const maxSectorLow = Math.max(...sectorLowest.map(s => s.emissions), 1);

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconLayoutDashboard size={22} style={{ color: '#2563eb' }} /> Dashboard
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Reporting Year</span>
          <select className="field-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={{ width: 120 }}>
            {(data?.availableYears?.length ? data.availableYears : [selectedYear]).filter(Boolean).map(year => (
              <option key={year} value={year}>FY {year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        {/* Total Financed Emission */}
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Total Financed Emission</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#1E293B' }}>{totalCapturedEmissions.toLocaleString()}</span>
            <span style={{ fontSize: 11, background: '#EFF6FF', color: '#2563EB', padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>{`FY ${data?.selectedYear || selectedYear}`}</span>
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>tCO2e</div>
        </div>
        {/* Portfolio Coverage */}
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Portfolio Coverage</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1E293B' }}>{data?.portfolioCoverage ?? 0}%</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>% of total active loan book by principal value</div>
        </div>
        {/* Pending Approvals */}
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Pending Approvals</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1E293B' }}>{data?.pendingApprovals ?? 0}</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>Submitted captures awaiting review</div>
        </div>
        {/* Avg DQ */}
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Average Data Quality Score</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1E293B' }}>{data?.avgDataQuality ?? 0}</div>
          <div style={{ fontSize: 11, color: (data?.avgDataQuality ?? 0) <= 2.0 && (data?.avgDataQuality ?? 0) > 0 ? '#10B981' : (data?.avgDataQuality ?? 0) <= 3.5 && (data?.avgDataQuality ?? 0) > 0 ? '#F59E0B' : '#EF4444', fontWeight: 600 }}>
            {data?.avgDataQuality === 0 ? 'No data' : (data?.avgDataQuality ?? 0) <= 2.0 ? 'Green (Good)' : (data?.avgDataQuality ?? 0) <= 3.5 ? 'Yellow (Moderate)' : 'Red (Poor)'}
          </div>
        </div>
      </div>

      {/* Asset Class Emission + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, marginBottom: 14 }}>
        <Card>
          <SectionTitle>Asset Class-Wise Emission</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr><Th>Asset Class</Th><Th right>Financed Emissions</Th><Th right>Percentage (%)</Th></tr></thead>
            <tbody>
              {displayBreakdown.map(r => {
                const percentage = totalCapturedEmissions > 0 ? (r.emissions / totalCapturedEmissions) * 100 : 0;
                return (
                  <tr key={r.assetClass}>
                    <Td bold={r.assetClass === 'Business Loans'}>{r.assetClass}</Td>
                    <Td right mono>{r.emissions.toLocaleString()}</Td>
                    <Td right>{percentage.toFixed(2)}%</Td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: '2px solid #E2E8F0' }}>
                <td style={{ padding: '9px 10px', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Total</td>
                <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>{totalCapturedEmissions.toLocaleString()}</td>
                <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, fontWeight: 700 }}>100%</td>
              </tr>
            </tbody>
          </table>
        </Card>
        <Card>
          <SectionTitle>Asset Class (%)</SectionTitle>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            {displayBreakdown.length > 0 && displayBreakdown.some(d => d.emissions > 0) ? (
              <DonutChart data={displayBreakdown.map(a => ({ value: a.emissions, label: a.assetClass }))} colors={DONUT_ASSET_COLORS} size={150} />
            ) : (
              <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 12 }}>No emissions data</div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {displayBreakdown.map((a, i) => (
              <div key={a.assetClass} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: DONUT_ASSET_COLORS[i % DONUT_ASSET_COLORS.length], flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#374151' }}>{a.assetClass} ({a.loanCount} loan{a.loanCount !== 1 ? 's' : ''})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sector Wise Emissions + Sector Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, marginBottom: 14 }}>
        <Card>
          <SectionTitle>Sector Wise Emissions</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr><Th>Rank</Th><Th>Sector</Th><Th right>Financed Emissions (tCO2e)</Th><Th right>% of Total</Th><Th right>Avg Data Quality Score</Th><Th right>YoY Trend</Th></tr></thead>
            <tbody>
              {sectorEmissions.length > 0 ? (
                sectorEmissions.map(r => (
                  <tr key={r.rank}>
                    <Td>{r.rank}</Td>
                    <Td bold>{r.sector}</Td>
                    <Td right mono>{r.financedEmissions.toLocaleString()}</Td>
                    <Td right>{r.pctTotal.toFixed(2)}%</Td>
                    <Td right>{r.avgDQ}</Td>
                    <Td right><span style={{ color: r.yoyTrend === 'Stable' ? '#64748B' : r.yoyTrend.startsWith('+') ? '#F97316' : '#10B981', fontSize: 12 }}>{r.yoyTrend}</span></Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 20, color: '#64748b' }}>No approved captures available to show sector breakdown.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
        <Card>
          <SectionTitle>Sector Wise (%)</SectionTitle>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            {sectorEmissions.length > 0 && sectorEmissions.some(s => s.financedEmissions > 0) ? (
              <DonutChart data={sectorEmissions.map(s => ({ value: s.financedEmissions, label: s.sector }))} colors={DONUT_SECTOR_COLORS} size={150} />
            ) : (
              <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 12 }}>No emissions data</div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {sectorEmissions.map((s, i) => (
              <div key={s.sector} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: DONUT_SECTOR_COLORS[i % DONUT_SECTOR_COLORS.length], flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#374151' }}>{s.sector}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top 10 Highest */}
      <Card style={{ marginBottom: 14 }}>
        <SectionTitle>Top 10 Highest Emitting Exposures</SectionTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead><tr><Th>Rank</Th><Th>Loan ID</Th><Th>Borrower Name</Th><Th>Sector</Th><Th right>Financed Emissions (tCO2e)</Th><Th right>Data Quality Score</Th><Th>Asset Class</Th></tr></thead>
          <tbody>
            {top10Highest.length > 0 ? (
              top10Highest.map(r => (
                <tr key={r.rank}>
                  <Td>{r.rank}</Td>
                  <Td mono>{r.loanId}</Td>
                  <Td bold>{r.borrowerName}</Td>
                  <Td>{r.sector}</Td>
                  <Td right mono>{r.financedEmissions.toLocaleString()}</Td>
                  <Td right>{r.dq}</Td>
                  <Td><span style={{ fontSize: 11, background: '#EFF6FF', color: '#2563EB', padding: '2px 7px', borderRadius: 4 }}>{r.assetClass}</span></Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 20, color: '#64748b' }}>No approved loan configurations available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Top 10 Lowest */}
      <Card style={{ marginBottom: 14 }}>
        <SectionTitle>Top 10 Lowest Emitting Exposures</SectionTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead><tr><Th>Rank</Th><Th>Loan ID</Th><Th>Borrower Name</Th><Th>Sector</Th><Th right>Financed Emissions (tCO2e)</Th><Th right>Data Quality Score</Th><Th>Asset Class</Th></tr></thead>
          <tbody>
            {top10Lowest.length > 0 ? (
              top10Lowest.map(r => (
                <tr key={r.rank}>
                  <Td>{r.rank}</Td>
                  <Td mono>{r.loanId}</Td>
                  <Td bold>{r.borrowerName}</Td>
                  <Td>{r.sector}</Td>
                  <Td right mono>{r.financedEmissions.toLocaleString()}</Td>
                  <Td right>{r.dq}</Td>
                  <Td><span style={{ fontSize: 11, background: '#EFF6FF', color: '#2563EB', padding: '2px 7px', borderRadius: 4 }}>{r.assetClass}</span></Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 20, color: '#64748b' }}>No approved loan configurations available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Sector Highest & Lowest side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <Card>
          <SectionTitle>Sector-Wise Highest Emitting Exposures</SectionTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>
            <span>Sector</span><span>Financed Emissions (tCO2e)</span>
          </div>
          {sectorHighest.length > 0 ? (
            sectorHighest.map((s, i) => (
              <div key={s.sector} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: DONUT_SECTOR_COLORS[i % DONUT_SECTOR_COLORS.length] }} />
                    <span style={{ fontSize: 12, color: '#374151' }}>{s.sector}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', fontFamily: 'monospace' }}>{s.emissions.toLocaleString()}</span>
                </div>
                <HBar value={s.emissions} max={maxSector} color={DONUT_SECTOR_COLORS[i % DONUT_SECTOR_COLORS.length]} />
              </div>
            ))
          ) : (
            <div style={{ padding: 20, color: '#64748b', textAlign: 'center', fontSize: 12 }}>No emissions data to display</div>
          )}
        </Card>
        <Card>
          <SectionTitle>Sector-Wise Lowest Emitting Exposures</SectionTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>
            <span>Sector</span><span>Financed Emissions (tCO2e)</span>
          </div>
          {sectorLowest.length > 0 ? (
            sectorLowest.map((s, i) => (
              <div key={s.sector} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: DONUT_SECTOR_COLORS[i % DONUT_SECTOR_COLORS.length] }} />
                    <span style={{ fontSize: 12, color: '#374151' }}>{s.sector}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', fontFamily: 'monospace' }}>{s.emissions.toLocaleString()}</span>
                </div>
                <HBar value={s.emissions} max={maxSectorLow} color={DONUT_SECTOR_COLORS[i % DONUT_SECTOR_COLORS.length]} />
              </div>
            ))
          ) : (
            <div style={{ padding: 20, color: '#64748b', textAlign: 'center', fontSize: 12 }}>No emissions data to display</div>
          )}
        </Card>
      </div>

      {/* Yearly Comparison Table + Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <Card>
          <SectionTitle>Asset Class-Wise Yearly Comparison</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr><Th>Asset Class</Th><Th right>FY 2023 (tCO2e)</Th><Th right>FY 2024 (tCO2e)</Th><Th right>FY 2025 (tCO2e)</Th></tr></thead>
            <tbody>
              {yearlyComparison.length > 0 ? (
                yearlyComparison.map(r => (
                  <tr key={r.assetClass}>
                    <Td bold>{r.assetClass}</Td>
                    <Td right mono>{r.fy2023.toLocaleString()}</Td>
                    <Td right mono>{r.fy2024.toLocaleString()}</Td>
                    <Td right mono>{r.fy2025.toLocaleString()}</Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 20, color: '#64748b' }}>No historical emissions comparisons available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
        <Card>
          <SectionTitle>Asset Class-Wise Yearly Comparison Chart</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {yearlyComparison.length > 0 ? (
              yearlyComparison.map((r, idx) => (
                <div key={r.assetClass}>
                  <div style={{ fontSize: 11, color: '#374151', fontWeight: 500, marginBottom: 4 }}>{r.assetClass}</div>
                  {[{ v: r.fy2023, label: 'FY 2023', color: '#1976D2' }, { v: r.fy2024, label: 'FY 2024', color: '#42A5F5' }, { v: r.fy2025, label: 'FY 2025', color: '#90CAF9' }].map(bar => (
                    <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <div style={{ width: `${Math.max((bar.v / maxYearly) * 180, 4)}px`, height: 10, background: bar.color, borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'monospace' }}>{bar.v.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div style={{ padding: 20, color: '#64748b', textAlign: 'center', fontSize: 12 }}>No emissions data to display</div>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              {[{ color: '#1976D2', label: 'FY 2023' }, { color: '#42A5F5', label: 'FY 2024' }, { color: '#90CAF9', label: 'FY 2025' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 14, height: 8, background: l.color, borderRadius: 2 }} />
                  <span style={{ fontSize: 10, color: '#64748B' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Yearly Trend Table + Bar Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card>
          <SectionTitle>Yearly Trend of Financed Emissions</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr><Th>Year</Th><Th right>Financed Emissions (tCO2e)</Th></tr></thead>
            <tbody>
              {yearlyTrend.length > 0 ? (
                yearlyTrend.map(r => (
                  <tr key={r.year}><Td bold>{r.year}</Td><Td right mono>{r.financedEmissions.toLocaleString()}</Td></tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', padding: 20, color: '#64748b' }}>No trend data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
        <Card>
          <SectionTitle>Financed Emissions Trend Chart</SectionTitle>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, height: 120, padding: '0 10px', marginTop: 10 }}>
            {yearlyTrend.length > 0 ? (
              yearlyTrend.map(r => {
                const maxVal = Math.max(...yearlyTrend.map(t => t.financedEmissions), 1);
                const h = Math.max((r.financedEmissions / maxVal) * 100, 10);
                return (
                  <div key={r.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                    <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'monospace' }}>{(r.financedEmissions / 1000).toFixed(0)}K</span>
                    <div style={{ width: '100%', maxWidth: 60, height: `${h}px`, background: '#2196F3', borderRadius: '4px 4px 0 0' }} />
                    <span style={{ fontSize: 11, color: '#374151', fontWeight: 500 }}>{r.year}</span>
                  </div>
                );
              })
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 12 }}>No emissions data to display</div>
            )}
          </div>
        </Card>
      </div>

      <div style={{ textAlign: 'center', fontSize: 11, color: '#94A3B8', marginTop: 24, paddingBottom: 16 }}>
        Copyright (c) 2026 <strong>World Of Circular Economy</strong> All rights reserved &nbsp;-&nbsp; Version 1.3.13 &nbsp;-&nbsp; English | Spanish
      </div>
    </div>
  );
}

