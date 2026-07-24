import { pool } from '../config/db.js';

export async function getAll() {
  const query = `
    SELECT dc.id, dc.activity_period as "activityPeriod", dc.loan_id as "loanId",
           dc.outstanding_amount as "outstandingAmount", dc.data_quality as "dataQuality",
           dc.financed_emissions as "financedEmissions", dc.status, dc.extra_data as "extraData",
           lc.asset_class as "assetClass", lc.borrower_name as "borrowerName",
           lc.borrower_type as "borrowerType", lc.sector, lc.city, lc.country,
           lc.loan_amount as "loanAmount", lc.loan_tenure as "loanTenure",
           lc.loan_start_date as "loanStartDate", lc.loan_end_date as "loanEndDate"
    FROM data_captures dc
    JOIN loan_configurations lc ON dc.loan_id = lc.loan_id
    ORDER BY dc.id ASC
  `;
  const res = await pool.query(query);
  return res.rows.map(row => ({
    ...row,
    outstandingAmount: Number(row.outstandingAmount || 0),
    financedEmissions: Number(row.financedEmissions || 0),
    loanAmount: Number(row.loanAmount || 0),
    // Destructure extraData to the top level for backwards compatibility with frontend models
    ...(row.extraData || {})
  }));
}

export async function findById(id) {
  const query = `
    SELECT dc.id, dc.activity_period as "activityPeriod", dc.loan_id as "loanId",
           dc.outstanding_amount as "outstandingAmount", dc.data_quality as "dataQuality",
           dc.financed_emissions as "financedEmissions", dc.status, dc.extra_data as "extraData",
           lc.asset_class as "assetClass", lc.borrower_name as "borrowerName",
           lc.borrower_type as "borrowerType", lc.sector, lc.city, lc.country,
           lc.loan_amount as "loanAmount", lc.loan_tenure as "loanTenure",
           lc.loan_start_date as "loanStartDate", lc.loan_end_date as "loanEndDate"
    FROM data_captures dc
    JOIN loan_configurations lc ON dc.loan_id = lc.loan_id
    WHERE dc.id = $1
  `;
  const res = await pool.query(query, [id]);
  if (res.rowCount === 0) return null;
  const row = res.rows[0];
  return {
    ...row,
    outstandingAmount: Number(row.outstandingAmount || 0),
    financedEmissions: Number(row.financedEmissions || 0),
    loanAmount: Number(row.loanAmount || 0),
    ...(row.extraData || {})
  };
}

export async function update(id, { outstandingAmount, dataQuality, financedEmissions, status, extraData }) {
  const query = `
    UPDATE data_captures
    SET outstanding_amount = $1,
        data_quality = $2,
        financed_emissions = $3,
        status = $4,
        extra_data = $5
    WHERE id = $6
    RETURNING *
  `;
  const res = await pool.query(query, [
    Number(outstandingAmount || 0),
    dataQuality,
    Number(financedEmissions || 0),
    status,
    JSON.stringify(extraData || {}),
    id
  ]);
  if (res.rowCount === 0) return null;
  return findById(id);
}

export async function updateStatusMultiple(ids, status) {
  if (!ids || ids.length === 0) return true;
  const query = `
    UPDATE data_captures
    SET status = $1
    WHERE id = ANY($2::integer[])
  `;
  await pool.query(query, [status, ids]);
  return true;
}
