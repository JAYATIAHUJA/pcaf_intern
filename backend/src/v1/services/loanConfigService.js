import * as loanConfigRepository from '../../repositories/loanConfigRepository.js';

export async function fetchAll() {
  return await loanConfigRepository.getAll();
}

export async function createConfig(config) {
  if (!config.loanId) {
    throw { statusCode: 400, message: 'Loan ID is required' };
  }
  if (!config.assetClass) {
    throw { statusCode: 400, message: 'Asset Class is required' };
  }
  if (!config.borrowerName) {
    throw { statusCode: 400, message: 'Borrower Name is required' };
  }

  const existing = await loanConfigRepository.findByLoanId(config.loanId);
  if (existing) {
    throw { statusCode: 400, message: `Loan ID "${config.loanId}" already exists` };
  }

  return await loanConfigRepository.add(config);
}

export async function updateConfig(loanId, updates) {
  const result = await loanConfigRepository.update(loanId, updates);
  if (!result) {
    throw { statusCode: 404, message: 'Loan configuration not found' };
  }
  return result;
}

export async function deleteConfig(loanId) {
  const result = await loanConfigRepository.deleteByLoanId(loanId);
  if (!result) {
    throw { statusCode: 404, message: 'Loan configuration not found' };
  }
  return { success: true };
}

export async function importConfigs(loans) {
  return await loanConfigRepository.importMultiple(loans);
}

