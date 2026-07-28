import * as masterDataService from '../services/masterDataService.js';

export async function getMasterData(req, res) {
  try {
    const { category, activeOnly } = req.query;
    if (category) {
      const rows = await masterDataService.fetchCategory(category, activeOnly === 'true');
      return res.json(rows);
    }
    const grouped = await masterDataService.fetchAll();
    return res.json(grouped);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function createMasterData(req, res) {
  try {
    const created = await masterDataService.createOption(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function updateMasterData(req, res) {
  try {
    const updated = await masterDataService.updateOption(req.params.id, req.body);
    return res.json(updated);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}

export async function deleteMasterData(req, res) {
  try {
    const result = await masterDataService.deleteOption(req.params.id);
    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}
