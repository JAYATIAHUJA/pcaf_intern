import * as settingsRepository from '../../repositories/settingsRepository.js';

function createHttpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function requireFields(obj, fields) {
  for (const field of fields) {
    const val = obj[field];
    if (val === undefined || val === null || String(val).trim() === '') {
      throw createHttpError(400, `Missing required field: ${field}`);
    }
  }
}

export async function fetchSettings() {
  return settingsRepository.getSettings();
}

export async function updateOrganisation(updates) {
  if (!updates || typeof updates !== 'object') {
    throw createHttpError(400, 'Request body must be a JSON object');
  }

  const REQUIRED = ['name', 'country'];
  for (const field of REQUIRED) {
    if (field in updates) {
      if (!updates[field] || String(updates[field]).trim() === '') {
        throw createHttpError(400, `Field "${field}" cannot be empty`);
      }
    }
  }

  return settingsRepository.updateOrganisation(updates);
}


export async function updateReporting(updates) {
  if (!updates || typeof updates !== 'object') {
    throw createHttpError(400, 'Request body must be a JSON object');
  }

  return settingsRepository.updateReporting(updates);
}

export async function updateNotifications(updates) {
  if (!updates || typeof updates !== 'object') {
    throw createHttpError(400, 'Request body must be a JSON object');
  }

  const coerced = {};
  for (const [key, value] of Object.entries(updates)) {
    coerced[key] = Boolean(value);
  }

  return settingsRepository.updateNotifications(coerced);
}

export async function fetchIntegrations() {
  return settingsRepository.getIntegrations();
}

export async function connectIntegration(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw createHttpError(400, 'Integration ID must be a positive integer');
  }

  const result = await settingsRepository.connectIntegration(id);
  if (!result) {
    throw createHttpError(404, `Integration with id ${id} not found`);
  }
  return result;
}
