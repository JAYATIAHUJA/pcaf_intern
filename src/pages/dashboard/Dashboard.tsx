import {
  DASHBOARD_KPIS, ASSET_CLASS_EMISSION, SECTOR_EMISSIONS,
  TOP10_HIGHEST, TOP10_LOWEST, YEARLY_TREND, YEARLY_COMPARISON,
  SECTOR_HIGHEST, SECTOR_LOWEST, DONUT_ASSET_COLORS, DONUT_SECTOR_COLORS
} from '../../constants/mockData';

// ── Mini reusable pieces ─────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '16px 18px', ...style }}>{children}</div>;
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <div style={{ width: 4, height: 16, background: '#2196F3', borderRadius: 2 }} />
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{children}</span>
    </div>
  );
}
function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th style={{ padding: '8px 10px', textAlign: right ? 'right' : 'left', fontSize: 11, fontWeight: 600, color: '#64748B', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>{children}</th>;
}
function Td({ children, right, mono, bold }: { children: React.ReactNode; right?: boolean; mono?: boolean; bold?: boolean }) {
  return <td style={{ padding: '9px 10px', textAlign: right ? 'right' : 'left', fontSize: 12, color: bold ? '#0F172A' : '#374151', fontFamily: mono ? 'monospace' : 'inherit', fontWeight: bold ? 600 : 400, borderBottom: '1px solid #F1F5F9' }}>{children}</td>;
}

// ── Donut Chart (SVG) ────────────────────────────────────────────────────────
function DonutChart({ data, colors, size = 140 }: { data: { value: number; label: string }[]; colors: string[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r * 0.55;
  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + inner * Math.cos(startAngle), iy1 = cy + inner * Math.sin(startAngle);
    const ix2 = cx + inner * Math.cos(endAngle), iy2 = cy + inner * Math.sin(endAngle);
    const large = pct > 0.5 ? 1 : 0;
    return { path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${large} 0 ${ix1} ${iy1} Z`, color: colors[i % colors.length] };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth={1.5} />)}
    </svg>
  );
}

// ── Horizontal Bar ───────────────────────────────────────────────────────────
function HBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ background: '#F1F5F9', borderRadius: 3, height: 7, width: '100%' }}>
      <div style={{ background: color, borderRadius: 3, height: '100%', width: `${pct}%` }} />
    </div>
  );
}

export default function Dashboard() {
  const maxYearly = Math.max(...YEARLY_COMPARISON.map(r => Math.max(r.fy2023, r.fy2024, r.fy2025)));
  const maxSector = Math.max(...SECTOR_HIGHEST.map(s => s.emissions));
  const maxSectorLow = Math.max(...SECTOR_LOWEST.map(s => s.emissions));

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B', margin: '0 0 18px' }}>Dashboard</h2>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        {/* Total Financed Emission */}
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Total Financed Emission</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#1E293B' }}>268,450</span>
            <span style={{ fontSize: 11, background: '#ECFDF5', color: '#DC2626', padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>8% YoY</span>
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>tCO₂e</div>
        </div>
        {/* Portfolio Coverage */}
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Portfolio Coverage</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1E293B' }}>82%</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>% of total loan book by value</div>
        </div>
        {/* WACI */}
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Weighted Average Carbon Intensity (WACI)</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1E293B' }}>245</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>tCO₂e / USD million</div>
        </div>
        {/* Avg DQ */}
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Average Data Quality Score</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1E293B' }}>3.1</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>Yellow</div>
        </div>
      </div>

      {/* Asset Class Emission + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, marginBottom: 14 }}>
        <Card>
          <SectionTitle>Asset Class-Wise Emission</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr><Th>Asset Class</Th><Th right>Financed Emissions</Th><Th right>Percentage (%)</Th></tr></thead>
            <tbody>
              {ASSET_CLASS_EMISSION.map(r => (
                <tr key={r.assetClass}>
                  <Td bold={r.assetClass === 'Business Loans & Unlisted Equity'}>{r.assetClass}</Td>
                  <Td right mono>{r.financedEmissions.toLocaleString()}</Td>
                  <Td right>{r.percentage.toFixed(2)}%</Td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid #E2E8F0' }}>
                <td style={{ padding: '9px 10px', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Total</td>
                <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>268,450</td>
                <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, fontWeight: 700 }}>100%</td>
              </tr>
            </tbody>
          </table>
        </Card>
        <Card>
          <SectionTitle>Asset Class (%)</SectionTitle>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <DonutChart data={ASSET_CLASS_EMISSION.map(a => ({ value: a.financedEmissions, label: a.assetClass }))} colors={DONUT_ASSET_COLORS} size={150} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {ASSET_CLASS_EMISSION.map((a, i) => (
              <div key={a.assetClass} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: DONUT_ASSET_COLORS[i % DONUT_ASSET_COLORS.length], flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#374151' }}>{a.assetClass}</span>
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
            <thead><tr><Th>Rank</Th><Th>Sector</Th><Th right>Financed Emissions (tCO₂e)</Th><Th right>% of Total</Th><Th right>Avg Data Quality Score</Th><Th right>YoY Trend</Th></tr></thead>
            <tbody>
              {SECTOR_EMISSIONS.map(r => (
                <tr key={r.rank}>
                  <Td>{r.rank}</Td>
                  <Td bold>{r.sector}</Td>
                  <Td right mono>{r.financedEmissions.toLocaleString()}</Td>
                  <Td right>{r.pctTotal.toFixed(2)}%</Td>
                  <Td right>{r.avgDQ}</Td>
                  <Td right><span style={{ color: r.yoyTrend === 'Stable' ? '#64748B' : '#F97316', fontSize: 12 }}>{r.yoyTrend !== 'Stable' ? '↑ ' : ''}{r.yoyTrend}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <SectionTitle>Asset Class (%)</SectionTitle>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <DonutChart data={SECTOR_EMISSIONS.map(s => ({ value: s.financedEmissions, label: s.sector }))} colors={DONUT_SECTOR_COLORS} size={150} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {SECTOR_EMISSIONS.map((s, i) => (
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
        <SectionTitle>Top 10 Highest Emitting Exposures (FY 2025)</SectionTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead><tr><Th>Rank</Th><Th>Loan ID</Th><Th>Borrower Name</Th><Th>Sector</Th><Th right>Financed Emissions (tCO₂e)</Th><Th right>Data Quality Score</Th><Th>Asset Class</Th></tr></thead>
          <tbody>
            {TOP10_HIGHEST.map(r => (
              <tr key={r.rank}>
                <Td>{r.rank}</Td>
                <Td mono>{r.loanId}</Td>
                <Td bold>{r.borrowerName}</Td>
                <Td>{r.sector}</Td>
                <Td right mono>{r.financedEmissions.toLocaleString()}</Td>
                <Td right>{r.dq}</Td>
                <Td><span style={{ fontSize: 11, background: '#EFF6FF', color: '#2563EB', padding: '2px 7px', borderRadius: 4 }}>{r.assetClass}</span></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Top 10 Lowest */}
      <Card style={{ marginBottom: 14 }}>
        <SectionTitle>Top 10 Lowest Emitting Exposures (FY 2025)</SectionTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead><tr><Th>Rank</Th><Th>Loan ID</Th><Th>Borrower Name</Th><Th>Sector</Th><Th right>Financed Emissions (tCO₂e)</Th><Th right>Data Quality Score</Th><Th>Asset Class</Th></tr></thead>
          <tbody>
            {TOP10_LOWEST.map(r => (
              <tr key={r.rank}>
                <Td>{r.rank}</Td>
                <Td mono>{r.loanId}</Td>
                <Td bold>{r.borrowerName}</Td>
                <Td>{r.sector}</Td>
                <Td right mono>{r.financedEmissions.toLocaleString()}</Td>
                <Td right>{r.dq}</Td>
                <Td><span style={{ fontSize: 11, background: '#EFF6FF', color: '#2563EB', padding: '2px 7px', borderRadius: 4 }}>{r.assetClass}</span></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Sector Highest & Lowest side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <Card>
          <SectionTitle>Sector-Wise Highest Emitting Exposures</SectionTitle>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>76,240</div>
          <div style={{ height: 4, background: 'linear-gradient(90deg,#2196F3,#4CAF50,#FF9800,#9C27B0)', borderRadius: 2, marginBottom: 14 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>
            <span>Sector</span><span>Financed Emissions (tCO₂e)</span>
          </div>
          {SECTOR_HIGHEST.map((s, i) => (
            <div key={s.sector} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: DONUT_SECTOR_COLORS[i] }} />
                  <span style={{ fontSize: 12, color: '#374151' }}>{s.sector}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', fontFamily: 'monospace' }}>{s.emissions.toLocaleString()}</span>
              </div>
              <HBar value={s.emissions} max={maxSector} color={DONUT_SECTOR_COLORS[i]} />
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle>Sector-Wise Lowest Emitting Exposures</SectionTitle>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>579</div>
          <div style={{ height: 4, background: 'linear-gradient(90deg,#F44336,#4CAF50,#607D8B,#FF9800)', borderRadius: 2, marginBottom: 14 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>
            <span>Sector</span><span>Financed Emissions (tCO₂e)</span>
          </div>
          {SECTOR_LOWEST.map((s, i) => (
            <div key={s.sector} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: DONUT_SECTOR_COLORS[i] }} />
                  <span style={{ fontSize: 12, color: '#374151' }}>{s.sector}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', fontFamily: 'monospace' }}>{s.emissions.toLocaleString()}</span>
              </div>
              <HBar value={s.emissions} max={maxSectorLow} color={DONUT_SECTOR_COLORS[i]} />
            </div>
          ))}
        </Card>
      </div>

      {/* Yearly Comparison Table + Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <Card>
          <SectionTitle>Asset Class-Wise Yearly Comparison</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr><Th>Asset Class</Th><Th right>FY 2023 (tCO₂e)</Th><Th right>FY 2024 (tCO₂e)</Th><Th right>FY 2025 (tCO₂e)</Th></tr></thead>
            <tbody>
              {YEARLY_COMPARISON.map(r => (
                <tr key={r.assetClass}>
                  <Td bold>{r.assetClass}</Td>
                  <Td right mono>{r.fy2023.toLocaleString()}</Td>
                  <Td right mono>{r.fy2024.toLocaleString()}</Td>
                  <Td right mono>{r.fy2025.toLocaleString()}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <SectionTitle>Asset Class-Wise Yearly Comparison</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {YEARLY_COMPARISON.map((r, idx) => (
              <div key={r.assetClass}>
                <div style={{ fontSize: 11, color: '#374151', fontWeight: 500, marginBottom: 4 }}>{r.assetClass}</div>
                {[{ v: r.fy2023, label: 'FY 2023', color: '#1976D2' }, { v: r.fy2024, label: 'FY 2024', color: '#42A5F5' }, { v: r.fy2025, label: 'FY 2025', color: '#90CAF9' }].map(bar => (
                  <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <div style={{ width: `${Math.max((bar.v / maxYearly) * 180, 4)}px`, height: 10, background: bar.color, borderRadius: 2 }} />
                    <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'monospace' }}>{bar.v.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ))}
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
            <thead><tr><Th>Year</Th><Th right>Financed Emissions (tCO₂e)</Th></tr></thead>
            <tbody>
              {YEARLY_TREND.map(r => (
                <tr key={r.year}><Td bold>{r.year}</Td><Td right mono>{r.financedEmissions.toLocaleString()}</Td></tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <SectionTitle>Financed Emissions (tCO₂E)</SectionTitle>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, height: 120, padding: '0 10px' }}>
            {YEARLY_TREND.map(r => {
              const maxVal = Math.max(...YEARLY_TREND.map(t => t.financedEmissions));
              const h = Math.max((r.financedEmissions / maxVal) * 100, 10);
              return (
                <div key={r.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                  <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'monospace' }}>{(r.financedEmissions / 1000).toFixed(0)}K</span>
                  <div style={{ width: '100%', maxWidth: 60, height: `${h}px`, background: '#2196F3', borderRadius: '4px 4px 0 0' }} />
                  <span style={{ fontSize: 11, color: '#374151', fontWeight: 500 }}>{r.year}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div style={{ textAlign: 'center', fontSize: 11, color: '#94A3B8', marginTop: 24, paddingBottom: 16 }}>
        Copyright © 2026 <strong>World Of Circular Economy</strong> All rights reserved &nbsp;·&nbsp; Version 1.3.13 &nbsp;·&nbsp; English | Spanish
      </div>
    </div>
  );
}
