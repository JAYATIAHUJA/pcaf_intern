import { pool } from '../../config/db.js';

const yearExpr = "CASE WHEN dc.activity_period ~ '^\\d{4}' THEN LEFT(dc.activity_period, 4) ELSE RIGHT(dc.activity_period, 4) END";

export async function fetchDashboardStats(requestedYear) {
  const availableYears = await fetchAvailableYears();
  const selectedYear = requestedYear || availableYears[availableYears.length - 1] || String(new Date().getFullYear());
  const yearFilter = `AND ${yearExpr} = $1`;
  const params = [selectedYear];

  const totalEmissionsRes = await pool.query(
    `SELECT SUM(financed_emissions) as total FROM data_captures dc WHERE status = 'Approved' ${yearFilter}`,
    params
  );
  const totalFinancedEmissions = Number(totalEmissionsRes.rows[0]?.total || 0);

  const totalValueRes = await pool.query("SELECT SUM(loan_amount) as total FROM loan_configurations WHERE loan_status = 'Active'");
  const totalLoanBookValue = Number(totalValueRes.rows[0]?.total || 0);

  const coveredValueRes = await pool.query(`
    SELECT SUM(loan_amount) as covered
    FROM loan_configurations lc
    WHERE lc.loan_status = 'Active'
      AND EXISTS (
        SELECT 1 FROM data_captures dc
        WHERE dc.loan_id = lc.loan_id AND dc.status = 'Approved' ${yearFilter}
      )
  `, params);
  const coveredLoanValue = Number(coveredValueRes.rows[0]?.covered || 0);
  const portfolioCoverage = totalLoanBookValue > 0 ? Math.round((coveredLoanValue / totalLoanBookValue) * 100) : 0;

  const avgDqRes = await pool.query(`
    SELECT AVG(CAST(SUBSTRING(data_quality FROM 1 FOR 1) AS NUMERIC)) as avg_dq
    FROM data_captures dc
    WHERE status = 'Approved' AND data_quality IS NOT NULL AND data_quality <> '' ${yearFilter}
  `, params);
  const avgDataQuality = avgDqRes.rows[0]?.avg_dq ? parseFloat(Number(avgDqRes.rows[0].avg_dq).toFixed(1)) : 0;

  const pendingRes = await pool.query(
    `SELECT COUNT(*) as count FROM data_captures dc WHERE status = 'Submitted & Pending' ${yearFilter}`,
    params
  );
  const pendingApprovals = parseInt(pendingRes.rows[0]?.count || 0, 10);

  const assetClassRes = await pool.query(`
    SELECT lc.asset_class as "assetClass",
           COALESCE(SUM(dc.financed_emissions), 0) as emissions,
           COUNT(DISTINCT lc.loan_id) as "loanCount"
    FROM loan_configurations lc
    LEFT JOIN data_captures dc ON lc.loan_id = dc.loan_id AND dc.status = 'Approved' AND ${yearExpr} = $1
    WHERE lc.loan_status = 'Active'
    GROUP BY lc.asset_class
    ORDER BY emissions DESC
  `, params);
  const assetClassBreakdown = assetClassRes.rows.map(r => ({ assetClass: r.assetClass, emissions: Number(r.emissions), loanCount: parseInt(r.loanCount || 0, 10) }));

  const sectorRes = await pool.query(`
    SELECT lc.sector,
           COALESCE(SUM(dc.financed_emissions), 0) as emissions,
           COALESCE(AVG(CAST(SUBSTRING(dc.data_quality FROM 1 FOR 1) AS NUMERIC)), 0) as "avgDQ"
    FROM loan_configurations lc
    LEFT JOIN data_captures dc ON lc.loan_id = dc.loan_id AND dc.status = 'Approved' AND ${yearExpr} = $1
    WHERE lc.loan_status = 'Active' AND lc.sector IS NOT NULL AND lc.sector <> '' AND lc.sector <> '-'
    GROUP BY lc.sector
    ORDER BY emissions DESC
  `, params);
  let rank = 1;
  const sectorBreakdown = sectorRes.rows.map(r => {
    const emissions = Number(r.emissions);
    return {
      rank: rank++,
      sector: r.sector,
      financedEmissions: emissions,
      pctTotal: parseFloat((totalFinancedEmissions > 0 ? (emissions / totalFinancedEmissions) * 100 : 0).toFixed(2)),
      avgDQ: parseFloat(Number(r.avgDQ).toFixed(1)),
      yoyTrend: 'Selected Year'
    };
  });

  const topExposuresHighest = await fetchTopExposures('DESC', selectedYear);
  const topExposuresLowest = await fetchTopExposures('ASC', selectedYear);
  const sectorHighest = sectorBreakdown.slice(0, 5).map(s => ({ sector: s.sector, emissions: s.financedEmissions }));
  const sectorLowest = [...sectorBreakdown].filter(s => s.financedEmissions > 0).reverse().slice(0, 5).map(s => ({ sector: s.sector, emissions: s.financedEmissions }));

  const yearlyComparison = await fetchYearlyComparison();
  const yearlyTrend = await fetchYearlyTrend(availableYears);

  return {
    selectedYear,
    availableYears,
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

async function fetchAvailableYears() {
  const res = await pool.query(`
    SELECT DISTINCT ${yearExpr} as year
    FROM data_captures dc
    WHERE dc.activity_period IS NOT NULL AND dc.activity_period <> ''
    ORDER BY year ASC
  `);
  return res.rows.map(row => row.year).filter(Boolean);
}

async function fetchTopExposures(direction, selectedYear) {
  const res = await pool.query(`
    SELECT dc.loan_id as "loanId", lc.borrower_name as "borrowerName", lc.sector,
           dc.financed_emissions as "financedEmissions", dc.data_quality as "dq", lc.asset_class as "assetClass"
    FROM data_captures dc
    JOIN loan_configurations lc ON dc.loan_id = lc.loan_id
    WHERE dc.status = 'Approved' AND dc.financed_emissions > 0 AND ${yearExpr} = $1
    ORDER BY dc.financed_emissions ${direction}
    LIMIT 10
  `, [selectedYear]);
  let rank = 1;
  return res.rows.map(r => ({ rank: rank++, loanId: r.loanId, borrowerName: r.borrowerName, sector: r.sector || '-', financedEmissions: Number(r.financedEmissions), dq: r.dq || 'None', assetClass: r.assetClass }));
}

async function fetchYearlyComparison() {
  const res = await pool.query(`
    SELECT lc.asset_class as "assetClass",
           COALESCE(SUM(CASE WHEN ${yearExpr} = '2023' THEN dc.financed_emissions ELSE 0 END), 0) as "fy2023",
           COALESCE(SUM(CASE WHEN ${yearExpr} = '2024' THEN dc.financed_emissions ELSE 0 END), 0) as "fy2024",
           COALESCE(SUM(CASE WHEN ${yearExpr} = '2025' THEN dc.financed_emissions ELSE 0 END), 0) as "fy2025"
    FROM loan_configurations lc
    JOIN data_captures dc ON lc.loan_id = dc.loan_id
    WHERE dc.status = 'Approved'
    GROUP BY lc.asset_class
  `);
  return res.rows.map(r => ({ assetClass: r.assetClass, fy2023: Number(r.fy2023), fy2024: Number(r.fy2024), fy2025: Number(r.fy2025) }));
}

async function fetchYearlyTrend(availableYears) {
  const res = await pool.query(`
    SELECT ${yearExpr} as year, SUM(dc.financed_emissions) as emissions
    FROM data_captures dc
    WHERE dc.status = 'Approved'
    GROUP BY ${yearExpr}
    ORDER BY year ASC
  `);
  const trendMap = Object.fromEntries(res.rows.map(row => [row.year, Number(row.emissions)]));
  const years = availableYears.length ? availableYears : ['2023', '2024', '2025'];
  return years.map(year => ({ year: `FY ${year}`, financedEmissions: trendMap[year] || 0 }));
}
