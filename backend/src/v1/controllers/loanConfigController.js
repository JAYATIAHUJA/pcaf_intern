import * as loanConfigService from '../services/loanConfigService.js';
import * as auditService from '../services/auditService.js';

export async function getConfigs(req, res) {
  try {
    const configs = await loanConfigService.fetchAll();
    return res.json(configs);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function createConfig(req, res) {
  try {
    const created = await loanConfigService.createConfig(req.body);
    
    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Created',
      loanId: created.loanId,
      entityType: 'Loan Configuration',
      changes: `Created loan configuration for borrower "${created.borrowerName}" (${created.assetClass}) with principal amount of ${Number(created.loanAmount).toLocaleString()}.`
    });

    return res.status(201).json(created);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function updateConfig(req, res) {
  try {
    const { loanId } = req.params;
    const existing = await loanConfigService.fetchAll().then(list => list.find(l => l.loanId === loanId));
    const updated = await loanConfigService.updateConfig(loanId, req.body);
    
    let changesDesc = `Updated configuration for borrower "${updated.borrowerName}".`;
    if (req.body.loanAmount !== undefined && Number(req.body.loanAmount) !== Number(existing.loanAmount)) {
      changesDesc += ` Principal Amount changed from ${Number(existing.loanAmount).toLocaleString()} to ${Number(req.body.loanAmount).toLocaleString()}.`;
    }
    if (req.body.loanStatus !== undefined && req.body.loanStatus !== existing.loanStatus) {
      changesDesc += ` Loan Status changed from "${existing.loanStatus}" to "${req.body.loanStatus}".`;
    }

    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Edited',
      loanId: loanId,
      entityType: 'Loan Configuration',
      changes: changesDesc
    });

    return res.json(updated);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function deleteConfig(req, res) {
  try {
    const { loanId } = req.params;
    const existing = await loanConfigService.fetchAll().then(list => list.find(l => l.loanId === loanId));
    const result = await loanConfigService.deleteConfig(loanId);
    
    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Deleted',
      loanId: loanId,
      entityType: 'Loan Configuration',
      changes: `Deleted loan configuration for borrower "${existing ? existing.borrowerName : 'Unknown'}" (${loanId}).`
    });

    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function importConfigs(req, res) {
  try {
    const { loans } = req.body;
    if (!loans || !Array.isArray(loans)) {
      return res.status(400).json({ error: 'Loans array is required' });
    }
    const result = await loanConfigService.importConfigs(loans);

    await auditService.logAction({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Imported',
      loanId: null,
      entityType: 'Loan Configuration',
      changes: `Imported ${result.loansCount} loan configurations and initialized/updated ${result.capturesCount} data captures via CSV upload.`
    });

    return res.json(result);
  } catch (err) {
    console.error('Error importing configs:', err);
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

