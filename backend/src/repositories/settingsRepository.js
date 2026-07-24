import { pool } from '../config/db.js';

function buildUpdateQuery(tableName, fieldMapping, updates) {
  const setClauses = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(updates)) {
    const column = fieldMapping[key];
    if (column) {
      setClauses.push(`"${column}" = $${i++}`);
      values.push(value);
    }
  }

  return {
    sql: setClauses.length > 0
      ? `UPDATE "${tableName}" SET ${setClauses.join(', ')} WHERE id = 1`
      : null,
    values,
  };
}

export async function getSettings() {
  const [orgRes, repRes, notifRes] = await Promise.all([
    pool.query('SELECT * FROM settings_organisation WHERE id = 1'),
    pool.query('SELECT * FROM settings_reporting WHERE id = 1'),
    pool.query('SELECT * FROM settings_notifications WHERE id = 1'),
  ]);

  const org   = orgRes.rows[0]   || {};
  const rep   = repRes.rows[0]   || {};
  const notif = notifRes.rows[0] || {};

  return {
    organisation: {
      name:                org.name                  || '',
      lei:                 org.lei                   || '',
      country:             org.country               || '',
      pcafSignatorySince:  org.pcaf_signatory_since  || '',
    },
    reporting: {
      fiscalYear:             rep.fiscal_year              || '',
      currency:               rep.currency                 || '',
      emissionFactorSource:   rep.emission_factor_source   || '',
      consolidationApproach:  rep.consolidation_approach   || '',
    },
    notifications: {
      pendingApprovals:  !!notif.pending_approvals,
      dataQualityDrops:  !!notif.data_quality_drops,
      emissionUpdates:   !!notif.emission_updates,
      monthlySummary:    !!notif.monthly_summary,
    },
  };
}

const ORG_FIELD_MAP = {
  name:               'name',
  lei:                'lei',
  country:            'country',
  pcafSignatorySince: 'pcaf_signatory_since',
};

export async function updateOrganisation(updates) {
  if (!updates || Object.keys(updates).length === 0) {
    return (await getSettings()).organisation;
  }
  const { sql, values } = buildUpdateQuery('settings_organisation', ORG_FIELD_MAP, updates);
  if (sql) await pool.query(sql, values);
  return (await getSettings()).organisation;
}

const REP_FIELD_MAP = {
  fiscalYear:            'fiscal_year',
  currency:              'currency',
  emissionFactorSource:  'emission_factor_source',
  consolidationApproach: 'consolidation_approach',
};

export async function updateReporting(updates) {
  if (!updates || Object.keys(updates).length === 0) {
    return (await getSettings()).reporting;
  }
  const { sql, values } = buildUpdateQuery('settings_reporting', REP_FIELD_MAP, updates);
  if (sql) await pool.query(sql, values);
  return (await getSettings()).reporting;
}

const NOTIF_FIELD_MAP = {
  pendingApprovals: 'pending_approvals',
  dataQualityDrops: 'data_quality_drops',
  emissionUpdates:  'emission_updates',
  monthlySummary:   'monthly_summary',
};

export async function updateNotifications(updates) {
  if (!updates || Object.keys(updates).length === 0) {
    return (await getSettings()).notifications;
  }
  const { sql, values } = buildUpdateQuery('settings_notifications', NOTIF_FIELD_MAP, updates);
  if (sql) await pool.query(sql, values);
  return (await getSettings()).notifications;
}


export async function getIntegrations() {
  const res = await pool.query('SELECT * FROM integrations ORDER BY id ASC');
  return res.rows;
}

export async function connectIntegration(id) {
  const res = await pool.query(
    "UPDATE integrations SET status = 'Connected' WHERE id = $1 RETURNING *",
    [id],
  );
  if (res.rowCount === 0) return null;
  return res.rows[0];
}
