import { pool } from '../config/db.js';

export async function getAll() {
  const res = await pool.query('SELECT * FROM loan_configurations ORDER BY id DESC');
  return res.rows.map(row => ({
    id: row.id,
    loanId: row.loan_id,
    assetClass: row.asset_class,
    borrowerName: row.borrower_name,
    borrowerType: row.borrower_type,
    sector: row.sector,
    city: row.city,
    country: row.country,
    borrowerRegNo: row.borrower_reg_no,
    loanAmount: Number(row.loan_amount),
    loanTenure: row.loan_tenure,
    loanStartDate: row.loan_start_date,
    loanEndDate: row.loan_end_date,
    loanStatus: row.loan_status,
    ...row.extra_data
  }));
}

export async function findByLoanId(loanId) {
  const res = await pool.query('SELECT * FROM loan_configurations WHERE loan_id = $1', [loanId]);
  if (res.rowCount === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    loanId: row.loan_id,
    assetClass: row.asset_class,
    borrowerName: row.borrower_name,
    borrowerType: row.borrower_type,
    sector: row.sector,
    city: row.city,
    country: row.country,
    borrowerRegNo: row.borrower_reg_no,
    loanAmount: Number(row.loan_amount),
    loanTenure: row.loan_tenure,
    loanStartDate: row.loan_start_date,
    loanEndDate: row.loan_end_date,
    loanStatus: row.loan_status,
    ...row.extra_data
  };
}

export async function add(config) {
  const {
    loanId, assetClass, borrowerName, borrowerType, sector, city, country,
    borrowerRegNo, loanAmount, loanTenure, loanStartDate, loanEndDate, loanStatus,
    ...extraData
  } = config;

  await pool.query(
    `INSERT INTO loan_configurations(loan_id, asset_class, borrower_name, borrower_type, sector, city, country, borrower_reg_no, loan_amount, loan_tenure, loan_start_date, loan_end_date, loan_status, extra_data)
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     RETURNING *`,
    [
      loanId, assetClass, borrowerName, borrowerType || '', sector || '', city || '', country || '',
      borrowerRegNo || '', Number(loanAmount || 0), Number(loanTenure || 0), loanStartDate || '', loanEndDate || '', loanStatus || 'Active',
      JSON.stringify(extraData || {})
    ]
  );
  return findByLoanId(loanId);
}

export async function update(loanId, config) {
  const {
    borrowerName, borrowerType, sector, city, country,
    borrowerRegNo, loanAmount, loanTenure, loanStartDate, loanEndDate, loanStatus,
    ...extraData
  } = config;

  const existing = await pool.query('SELECT * FROM loan_configurations WHERE loan_id = $1', [loanId]);
  if (existing.rowCount === 0) return null;
  const current = existing.rows[0];

  const updatedExtraData = {
    ...current.extra_data,
    ...extraData
  };

  await pool.query(
    `UPDATE loan_configurations
     SET borrower_name = $1, borrower_type = $2, sector = $3, city = $4, country = $5,
         borrower_reg_no = $6, loan_amount = $7, loan_tenure = $8, loan_start_date = $9,
         loan_end_date = $10, loan_status = $11, extra_data = $12
     WHERE loan_id = $13`,
    [
      borrowerName !== undefined ? borrowerName : current.borrower_name,
      borrowerType !== undefined ? borrowerType : current.borrower_type,
      sector !== undefined ? sector : current.sector,
      city !== undefined ? city : current.city,
      country !== undefined ? country : current.country,
      borrowerRegNo !== undefined ? borrowerRegNo : current.borrower_reg_no,
      loanAmount !== undefined ? Number(loanAmount) : Number(current.loan_amount),
      loanTenure !== undefined ? Number(loanTenure) : current.loan_tenure,
      loanStartDate !== undefined ? loanStartDate : current.loan_start_date,
      loanEndDate !== undefined ? loanEndDate : current.loan_end_date,
      loanStatus !== undefined ? loanStatus : current.loan_status,
      JSON.stringify(updatedExtraData),
      loanId
    ]
  );

  return findByLoanId(loanId);
}

export async function deleteByLoanId(loanId) {
  const res = await pool.query('DELETE FROM loan_configurations WHERE loan_id = $1', [loanId]);
  return res.rowCount > 0;
}

export async function importMultiple(loans) {
  const client = await pool.connect();
  let loansCount = 0;
  let capturesCount = 0;
  try {
    await client.query('BEGIN');
    for (const loan of loans) {
      const {
        loanId, assetClass, borrowerName, borrowerType, sector, city, country,
        borrowerRegNo, loanAmount, loanTenure, loanStartDate, loanEndDate, loanStatus,
        outstandingAmount, activityPeriod, financedEmissions, dataQuality,
        ...extraData
      } = loan;

      if (!loanId || !assetClass || !borrowerName) continue;

      const checkRes = await client.query('SELECT id, extra_data FROM loan_configurations WHERE loan_id = $1', [loanId]);
      if (checkRes.rowCount > 0) {
        const existingExtra = checkRes.rows[0].extra_data || {};
        const updatedExtra = { ...existingExtra, ...extraData };
        await client.query(`
          UPDATE loan_configurations
          SET asset_class = $1, borrower_name = $2, borrower_type = $3, sector = $4, city = $5, country = $6,
              borrower_reg_no = $7, loan_amount = $8, loan_tenure = $9, loan_start_date = $10,
              loan_end_date = $11, loan_status = $12, extra_data = $13
          WHERE loan_id = $14
        `, [
          assetClass, borrowerName, borrowerType || '', sector || '', city || '', country || '',
          borrowerRegNo || '', Number(loanAmount || 0), Number(loanTenure || 0), loanStartDate || '', loanEndDate || '', loanStatus || 'Active',
          JSON.stringify(updatedExtra), loanId
        ]);
      } else {
        await client.query(`
          INSERT INTO loan_configurations(loan_id, asset_class, borrower_name, borrower_type, sector, city, country, borrower_reg_no, loan_amount, loan_tenure, loan_start_date, loan_end_date, loan_status, extra_data)
          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [
          loanId, assetClass, borrowerName, borrowerType || '', sector || '', city || '', country || '',
          borrowerRegNo || '', Number(loanAmount || 0), Number(loanTenure || 0), loanStartDate || '', loanEndDate || '', loanStatus || 'Active',
          JSON.stringify(extraData)
        ]);
      }
      loansCount++;

      if (outstandingAmount !== undefined || activityPeriod) {
        const period = activityPeriod || 'Jun 2026';
        const amt = Number(outstandingAmount || 0);
        const emissions = Number(financedEmissions || 0);
        const dq = dataQuality || null;
        
        let status = 'Pending for Capture';
        if (emissions > 0 || dq) {
          status = 'Submitted & Pending';
        }

        const capCheck = await client.query('SELECT id FROM data_captures WHERE loan_id = $1 AND activity_period = $2', [loanId, period]);
        if (capCheck.rowCount > 0) {
          await client.query(`
            UPDATE data_captures
            SET outstanding_amount = $1, data_quality = $2, financed_emissions = $3, status = $4
            WHERE loan_id = $5 AND activity_period = $6
          `, [amt, dq, emissions, status, loanId, period]);
        } else {
          await client.query(`
            INSERT INTO data_captures(activity_period, loan_id, outstanding_amount, data_quality, financed_emissions, status, extra_data)
            VALUES($1, $2, $3, $4, $5, $6, $7)
          `, [period, loanId, amt, dq, emissions, status, '{}']);
        }
        capturesCount++;
      }
    }
    await client.query('COMMIT');
    return { loansCount, capturesCount };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
