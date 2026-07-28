export async function seed(client) {
  const auditCheck = await client.query('SELECT COUNT(*) FROM audit_logs');
  if (parseInt(auditCheck.rows[0].count) === 0) {
    console.log('Seeding initial audit logs...');
    const seededLogs = [
      { userId: 4, userName: 'Arjun Kapoor', action: 'Submitted', loanId: 'BL-KE-001', entityType: 'Data Capture', changes: 'Outstanding Amount set to 1,540,000. DQ Score: 2a.' },
      { userId: 4, userName: 'Arjun Kapoor', action: 'Created draft', loanId: 'BL-KE-001', entityType: 'Data Capture', changes: 'Created draft entry for June 2026.' },
      { userId: 1, userName: 'Jayati Ahuja', action: 'User logged in', loanId: null, entityType: 'Auth', changes: 'Logged in successfully from IP 192.168.1.50.' },
      { userId: 5, userName: 'Demo Analyst', action: 'Submitted', loanId: 'BL-KE-006', entityType: 'Data Capture', changes: 'Outstanding Amount set to 1,280,000. DQ Score: 1a.' },
      { userId: 5, userName: 'Demo Analyst', action: 'Edited draft', loanId: 'MV-KE-001', entityType: 'Data Capture', changes: 'Updated actual fuel consumption to 1,850 liters.' }
    ];

    for (const log of seededLogs) {
      await client.query(
        `INSERT INTO audit_logs(user_id, user_name, action, loan_id, entity_type, changes)
         VALUES($1, $2, $3, $4, $5, $6)`,
        [log.userId, log.userName, log.action, log.loanId, log.entityType, log.changes]
      );
    }
  }
}

