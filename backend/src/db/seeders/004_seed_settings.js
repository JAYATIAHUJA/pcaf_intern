export async function seed(client) {
  const orgCheck = await client.query('SELECT COUNT(*) FROM settings_organisation');
  if (parseInt(orgCheck.rows[0].count) === 0) {
    console.log('Seeding initial settings...');
    await client.query(`
      INSERT INTO settings_organisation(id, name, lei, country, pcaf_signatory_since)
      VALUES(1, 'Meridian Capital Bank', '2138004GERSZ2BBSWP69', 'India', '2021');
    `);
    await client.query(`
      INSERT INTO settings_reporting(id, fiscal_year, currency, emission_factor_source, consolidation_approach)
      VALUES(1, 'January - December (Calendar Year)', 'USD - US Dollar', 'IEA World Energy Statistics 2024', 'Operational Control');
    `);
    await client.query(`
      INSERT INTO settings_notifications(id, pending_approvals, data_quality_drops, emission_updates, monthly_summary)
      VALUES(1, true, true, false, true);
    `);
  }
}
