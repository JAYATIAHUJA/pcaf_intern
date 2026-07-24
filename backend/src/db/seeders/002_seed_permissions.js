export async function seed(client) {
  console.log('Upserting role permissions matrix...');
  const seededPerms = {
    1: { Dashboard: ['view'], 'Data Capture': ['view','create','edit','delete','approve'], 'Loan Configuration': ['view','create','edit','delete'], 'User Management': ['view','create','edit','delete'], 'Role Management': ['view','create','edit','delete'], Settings: ['view','edit'], Reports: ['view','export'], 'Audit Trail': ['view'] },
    2: { Dashboard: ['view'], 'Data Capture': ['view','approve'], 'Loan Configuration': ['view'], 'User Management': ['view'], 'Role Management': [], Settings: ['view'], Reports: ['view','export'], 'Audit Trail': ['view'] },
    3: { Dashboard: ['view'], 'Data Capture': ['view','create','edit'], 'Loan Configuration': ['view'], 'User Management': [], 'Role Management': [], Settings: [], Reports: ['view'], 'Audit Trail': [] },
    4: { Dashboard: ['view'], 'Data Capture': ['view'], 'Loan Configuration': ['view'], 'User Management': [], 'Role Management': [], Settings: [], Reports: ['view'], 'Audit Trail': [] },
    5: { Dashboard: ['view'], 'Data Capture': ['view'], 'Loan Configuration': ['view'], 'User Management': [], 'Role Management': [], Settings: [], Reports: ['view','export'], 'Audit Trail': ['view'] },
  };

  for (const [roleIdStr, matrix] of Object.entries(seededPerms)) {
    const roleId = parseInt(roleIdStr);
    await client.query(
      `INSERT INTO permissions(role_id, dashboard, data_capture, loan_configuration, user_management, role_management, settings, reports, audit_trail) 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (role_id) DO UPDATE SET
         dashboard = EXCLUDED.dashboard,
         data_capture = EXCLUDED.data_capture,
         loan_configuration = EXCLUDED.loan_configuration,
         user_management = EXCLUDED.user_management,
         role_management = EXCLUDED.role_management,
         settings = EXCLUDED.settings,
         reports = EXCLUDED.reports,
         audit_trail = EXCLUDED.audit_trail`,
      [
        roleId,
        matrix['Dashboard'] || [],
        matrix['Data Capture'] || [],
        matrix['Loan Configuration'] || [],
        matrix['User Management'] || [],
        matrix['Role Management'] || [],
        matrix['Settings'] || [],
        matrix['Reports'] || [],
        matrix['Audit Trail'] || []
      ]
    );
  }
}
