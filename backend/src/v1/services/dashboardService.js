import { pool } from '../../config/db.js';

export async function fetchDashboardStats() {
  // 1. Total Financed Emissions (Approved captures)
  const totalEmissionsRes = await pool.query(
    "SELECT SUM(financed_emissions) as total FROM data_captures WHERE status = 'Approved'"
  );
  const totalFinancedEmissions = Number(totalEmissionsRes.rows[0]?.total || 0);

  // 2. Portfolio Coverage
  const totalValueRes = await pool.query(
    "SELECT SUM(loan_amount) as total FROM loan_configurations WHERE loan_status = 'Active'"
  );
  const totalLoanBookValue = Number(totalValueRes.rows[0]?.total || 0);

  const coveredValueRes = await pool.query(`
    SELECT SUM(loan_amount) as covered 
    FROM loan_configurations lc 
    WHERE lc.loan_status = 'Active' 
      AND EXISTS (
        SELECT 1 FROM data_captures dc 
        WHERE dc.loan_id = lc.loan_id 
          AND dc.status = 'Approved'
      )
  `);
  const coveredLoanValue = Number(coveredValueRes.rows[0]?.covered || 0);
  const portfolioCoverage = totalLoanBookValue > 0 
    ? Math.round((coveredLoanValue / totalLoanBookValue) * 100) 
    : 0;

  // 3. Average Data Quality Score
  const avgDqRes = await pool.query(`
    SELECT AVG(CAST(SUBSTRING(data_quality FROM 1 FOR 1) AS NUMERIC)) as avg_dq
    FROM data_captures
    WHERE status = 'Approved' AND data_quality IS NOT NULL AND data_quality <> ''
  `);
  const avgDataQuality = avgDqRes.rows[0]?.avg_dq 
    ? parseFloat(Number(avgDqRes.rows[0].avg_dq).toFixed(1)) 
    : 0;

  // 4. Pending Approvals count
  const pendingRes = await pool.query(
    "SELECT COUNT(*) as count FROM data_captures WHERE status = 'Submitted & Pending'"
  );
  const pendingApprovals = parseInt(pendingRes.rows[0]?.count || 0, 10);

  // 5. Asset Class-Wise Breakdown
  // Include all distinct asset classes that exist in loan configs
  const assetClassRes = await pool.query(`
    SELECT lc.asset_class as "assetClass",
           COALESCE(SUM(dc.financed_emissions), 0) as emissions,
           COUNT(DISTINCT lc.loan_id) as "loanCount"
    FROM loan_configurations lc
    LEFT JOIN data_captures dc ON lc.loan_id = dc.loan_id AND dc.status = 'Approved'
    WHERE lc.loan_status = 'Active'
    GROUP BY lc.asset_class
    ORDER BY emissions DESC
  `);
  const assetClassBreakdown = assetClassRes.rows.map(r => ({
    assetClass: r.assetClass,
    emissions: Number(r.emissions),
    loanCount: parseInt(r.loanCount || 0, 10)
  }));

  // 6. Sector-Wise Breakdown
  // Get emissions for YoY trend calculation
  const sectorTrendRes = await pool.query(`
    SELECT lc.sector,
           SUM(CASE WHEN RIGHT(dc.activity_period, 4) = '2025' THEN dc.financed_emissions ELSE 0 END) as emissions_2025,
           SUM(CASE WHEN RIGHT(dc.activity_period, 4) = '2024' THEN dc.financed_emissions ELSE 0 END) as emissions_2024
    FROM loan_configurations lc
    JOIN data_captures dc ON lc.loan_id = dc.loan_id
    WHERE dc.status = 'Approved' AND lc.sector IS NOT NULL AND lc.sector <> '' AND lc.sector <> '-'
    GROUP BY lc.sector
  `);

  const sectorTrends = {};
  for (const row of sectorTrendRes.rows) {
    const e25 = Number(row.emissions_2025 || 0);
    const e24 = Number(row.emissions_2024 || 0);
    if (e24 > 0) {
      const diffPct = ((e25 - e24) / e24) * 100;
      if (Math.abs(diffPct) < 0.5) {
        sectorTrends[row.sector] = 'Stable';
      } else {
        sectorTrends[row.sector] = `${diffPct > 0 ? '+' : ''}${Math.round(diffPct)}%`;
      }
    } else {
      sectorTrends[row.sector] = 'Stable';
    }
  }

  const sectorRes = await pool.query(`
    SELECT lc.sector,
           COALESCE(SUM(dc.financed_emissions), 0) as emissions,
           COALESCE(AVG(CAST(SUBSTRING(dc.data_quality FROM 1 FOR 1) AS NUMERIC)), 0) as "avgDQ"
    FROM loan_configurations lc
    LEFT JOIN data_captures dc ON lc.loan_id = dc.loan_id AND dc.status = 'Approved'
    WHERE lc.loan_status = 'Active' AND lc.sector IS NOT NULL AND lc.sector <> '' AND lc.sector <> '-'
    GROUP BY lc.sector
    ORDER BY emissions DESC
  `);

  let rank = 1;
  const sectorBreakdown = sectorRes.rows.map(r => {
    const emissions = Number(r.emissions);
    const pctTotal = totalFinancedEmissions > 0 ? (emissions / totalFinancedEmissions) * 100 : 0;
    return {
      rank: rank++,
      sector: r.sector,
      financedEmissions: emissions,
      pctTotal: parseFloat(pctTotal.toFixed(2)),
      avgDQ: parseFloat(Number(r.avgDQ).toFixed(1)),
      yoyTrend: sectorTrends[r.sector] || 'Stable'
    };
  });

  // 7. Top 10 Highest Emitting Exposures (FY 2025)
  const topHighestRes = await pool.query(`
    SELECT dc.loan_id as "loanId",
           lc.borrower_name as "borrowerName",
           lc.sector,
           dc.financed_emissions as "financedEmissions",
           dc.data_quality as "dq",
           lc.asset_class as "assetClass"
    FROM data_captures dc
    JOIN loan_configurations lc ON dc.loan_id = lc.loan_id
    WHERE dc.status = 'Approved' 
      AND dc.financed_emissions > 0
    ORDER BY dc.financed_emissions DESC
    LIMIT 10
  `);
  let hRank = 1;
  const topExposuresHighest = topHighestRes.rows.map(r => ({
    rank: hRank++,
    loanId: r.loanId,
    borrowerName: r.borrowerName,
    sector: r.sector || '-',
    financedEmissions: Number(r.financedEmissions),
    dq: r.dq || 'None',
    assetClass: r.assetClass
  }));

  // 8. Top 10 Lowest Emitting Exposures (FY 2025)
  const topLowestRes = await pool.query(`
    SELECT dc.loan_id as "loanId",
           lc.borrower_name as "borrowerName",
           lc.sector,
           dc.financed_emissions as "financedEmissions",
           dc.data_quality as "dq",
           lc.asset_class as "assetClass"
    FROM data_captures dc
    JOIN loan_configurations lc ON dc.loan_id = lc.loan_id
    WHERE dc.status = 'Approved' 
      AND dc.financed_emissions > 0
    ORDER BY dc.financed_emissions ASC
    LIMIT 10
  `);
  let lRank = 1;
  const topExposuresLowest = topLowestRes.rows.map(r => ({
    rank: lRank++,
    loanId: r.loanId,
    borrowerName: r.borrowerName,
    sector: r.sector || '-',
    financedEmissions: Number(r.financedEmissions),
    dq: r.dq || 'None',
    assetClass: r.assetClass
  }));

  // 9. Sector-Wise Highest and Lowest lists
  // Simple mapping of top sectors from the breakdown
  const sectorHighest = sectorBreakdown.slice(0, 5).map(s => ({
    sector: s.sector,
    emissions: s.financedEmissions
  }));
  
  const sectorLowest = [...sectorBreakdown]
    .filter(s => s.financedEmissions > 0)
    .reverse()
    .slice(0, 5)
    .map(s => ({
      sector: s.sector,
      emissions: s.financedEmissions
    }));

  // 10. Asset Class-Wise Yearly Comparison (FY 2023, FY 2024, FY 2025)
  const yearlyCompRes = await pool.query(`
    SELECT lc.asset_class as "assetClass",
           COALESCE(SUM(CASE WHEN RIGHT(dc.activity_period, 4) = '2023' THEN dc.financed_emissions ELSE 0 END), 0) as "fy2023",
           COALESCE(SUM(CASE WHEN RIGHT(dc.activity_period, 4) = '2024' THEN dc.financed_emissions ELSE 0 END), 0) as "fy2024",
           COALESCE(SUM(CASE WHEN RIGHT(dc.activity_period, 4) = '2025' THEN dc.financed_emissions ELSE 0 END), 0) as "fy2025"
    FROM loan_configurations lc
    JOIN data_captures dc ON lc.loan_id = dc.loan_id
    WHERE dc.status = 'Approved'
    GROUP BY lc.asset_class
  `);
  const yearlyComparison = yearlyCompRes.rows.map(r => ({
    assetClass: r.assetClass,
    fy2023: Number(r.fy2023),
    fy2024: Number(r.fy2024),
    fy2025: Number(r.fy2025)
  }));

  // 11. Yearly Trend of Financed Emissions
  const trendRes = await pool.query(`
    SELECT RIGHT(dc.activity_period, 4) as "year",
           SUM(dc.financed_emissions) as emissions
    FROM data_captures dc
    WHERE dc.status = 'Approved'
      AND RIGHT(dc.activity_period, 4) IN ('2023', '2024', '2025', '2026')
    GROUP BY RIGHT(dc.activity_period, 4)
    ORDER BY "year" ASC
  `);
  const trendMap = {};
  for (const row of trendRes.rows) {
    trendMap[row.year] = Number(row.emissions);
  }
  const targetYears = ['2023', '2024', '2025'];
  const yearlyTrend = targetYears.map(y => ({
    year: `FY ${y}`,
    financedEmissions: trendMap[y] || 0
  }));

  return {
    totalFinancedEmissions,
    portfolioCoverage,
    avgDataQuality,
    pendingApprovals,
    assetClassBreakdown,
    sectorBreakdown,
    topExposuresHighest,
    topExposuresLowest,
    sectorHighest,
    sectorLowest,
    yearlyComparison,
    yearlyTrend
  };
}
