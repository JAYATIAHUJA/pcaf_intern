import * as dataCaptureService from '../services/dataCaptureService.js';
import * as auditService from '../services/auditService.js';

export async function getDataCaptures(req, res) {
  try {
    const list = await dataCaptureService.fetchAll();
    return res.json(list);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function updateDataCapture(req, res) {
  try {
    const id = parseInt(req.params.id);
    const existing = await dataCaptureService.fetchById(id);
    const updated = await dataCaptureService.updateRecord(id, req.body);
    
    // Compute changes description
    let changesDesc = `Updated record. Status set to: ${req.body.status || updated.status || 'Pending'}.`;
    if (req.body.outstandingAmount !== undefined && Number(req.body.outstandingAmount) !== Number(existing.outstandingAmount)) {
      changesDesc += ` Outstanding Amount changed from ${Number(existing.outstandingAmount).toLocaleString()} to ${Number(req.body.outstandingAmount).toLocaleString()}.`;
    }
    if (req.body.dataQuality !== undefined && req.body.dataQuality !== existing.dataQuality) {
      changesDesc += ` DQ Score changed from "${existing.dataQuality || 'None'}" to "${req.body.dataQuality}".`;
    }
    
    let actionType = 'Edited draft';
    if (req.body.status === 'Submitted & Pending' && existing.status !== 'Submitted & Pending') {
      actionType = 'Submitted';
    }

    // Log the audit action
    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: actionType,
      loanId: updated.loanId,
      entityType: 'Data Capture',
      changes: changesDesc
    });

    return res.json(updated);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function approveDataCaptures(req, res) {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'IDs array is required' });
    }
    const idsInt = ids.map(id => typeof id === 'string' ? parseInt(id.replace(/\D/g, '')) : id);
    
    // Fetch details before update to log audit logs properly
    const records = [];
    for (const recordId of idsInt) {
      try {
        const rec = await dataCaptureService.fetchById(recordId);
        records.push(rec);
      } catch (e) {}
    }

    await dataCaptureService.approveRecords(idsInt);

    for (const rec of records) {
      await auditService.logAction({
        userId: req.user.id,
        userName: req.user.name,
        action: 'Approved',
        loanId: rec.loanId,
        entityType: 'Data Capture',
        changes: `Approved data capture record for period: ${rec.activityPeriod}. Financed Emissions: ${Number(rec.financedEmissions).toFixed(2)} tCO2e.`
      });
    }

    return res.json({ success: true, message: `${ids.length} records approved` });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function rejectDataCaptures(req, res) {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'IDs array is required' });
    }
    const idsInt = ids.map(id => typeof id === 'string' ? parseInt(id.replace(/\D/g, '')) : id);
    
    const records = [];
    for (const recordId of idsInt) {
      try {
        const rec = await dataCaptureService.fetchById(recordId);
        records.push(rec);
      } catch (e) {}
    }

    await dataCaptureService.rejectRecords(idsInt);

    for (const rec of records) {
      await auditService.logAction({
        userId: req.user.id,
        userName: req.user.name,
        action: 'Rejected',
        loanId: rec.loanId,
        entityType: 'Data Capture',
        changes: `Rejected data capture record for period: ${rec.activityPeriod}.`
      });
    }

    return res.json({ success: true, message: `${ids.length} records rejected` });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}
