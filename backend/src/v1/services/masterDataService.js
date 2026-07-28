import * as masterDataRepository from '../../repositories/masterDataRepository.js';

export async function fetchAll() {
  const rows = await masterDataRepository.getAll();
  return rows.reduce((grouped, row) => {
    if (!grouped[row.category]) grouped[row.category] = [];
    grouped[row.category].push(row);
    return grouped;
  }, {});
}

export async function fetchCategory(category, activeOnly = false) {
  if (!category) {
    throw { statusCode: 400, message: 'Category is required' };
  }
  return await masterDataRepository.getByCategory(category, activeOnly);
}

export async function createOption(option) {
  if (!option.category || !option.value) {
    throw { statusCode: 400, message: 'Category and value are required' };
  }
  try {
    return await masterDataRepository.create(option);
  } catch (err) {
    if (err.code === '23505') {
      throw { statusCode: 400, message: `Value "${option.value}" already exists in ${option.category}` };
    }
    throw err;
  }
}

export async function updateOption(id, option) {
  const updated = await masterDataRepository.update(id, option);
  if (!updated) {
    throw { statusCode: 404, message: 'Master data option not found' };
  }
  return updated;
}

export async function deleteOption(id) {
  const deleted = await masterDataRepository.remove(id);
  if (!deleted) {
    throw { statusCode: 404, message: 'Master data option not found' };
  }
  return { success: true };
}
