export async function seed(client) {
  const integrationsCheck = await client.query('SELECT COUNT(*) FROM integrations');
  if (parseInt(integrationsCheck.rows[0].count) === 0) {
    console.log('Seeding initial integrations...');
    const seededIntegrations = [
      { id: 1, name: 'Bloomberg ESG Data', status: 'Connected' },
      { id: 2, name: 'CDP Climate Disclosure', status: 'Not connected' },
      { id: 3, name: 'Core Banking System (CBS)', status: 'Connected' },
      { id: 4, name: 'SFTP Auto-import', status: 'Error' }
    ];

    for (const i of seededIntegrations) {
      await client.query(
        `INSERT INTO integrations(id, name, status) VALUES($1, $2, $3)`,
        [i.id, i.name, i.status]
      );
    }
    // Reset sequence
    await client.query(`SELECT setval('integrations_id_seq', (SELECT MAX(id) FROM integrations))`);
  }
}
