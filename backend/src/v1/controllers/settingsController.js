import * as settingsService from '../services/settingsService.js';
import * as auditService from '../services/auditService.js';

export async function getSettings(req, res) {
  try {
    const settings = await settingsService.fetchSettings();
    return res.json(settings);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function updateOrganisation(req, res) {
  try {
    const updated = await settingsService.updateOrganisation(req.body);
    
    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Updated settings',
      loanId: null,
      entityType: 'Settings',
      changes: `Updated organisation profile: "${updated.name}" (LEI: ${updated.lei}, Country: ${updated.country}).`
    });

    return res.json(updated);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function updateReporting(req, res) {
  try {
    const updated = await settingsService.updateReporting(req.body);

    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Updated settings',
      loanId: null,
      entityType: 'Settings',
      changes: `Updated reporting configuration: Fiscal Year set to "${updated.fiscalYear}", Currency to "${updated.currency}", consolidation approach to "${updated.consolidationApproach}".`
    });

    return res.json(updated);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function updateNotifications(req, res) {
  try {
    const updated = await settingsService.updateNotifications(req.body);

    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Updated settings',
      loanId: null,
      entityType: 'Settings',
      changes: `Updated notification settings: Pending Approvals=${updated.pendingApprovals}, Quality Drops=${updated.dataQualityDrops}, Emission Updates=${updated.emissionUpdates}, Summary=${updated.monthlySummary}.`
    });

    return res.json(updated);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function getIntegrations(req, res) {
  try {
    const integrations = await settingsService.fetchIntegrations();
    return res.json(integrations);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function connectIntegration(req, res) {
  try {
    const id = parseInt(req.params.id);
    const updated = await settingsService.connectIntegration(id);
    
    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Updated settings',
      loanId: null,
      entityType: 'Settings',
      changes: `Updated integration connection: "${updated.name}" is now "${updated.status}".`
    });

    return res.json(updated);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}
