import * as dataCaptureRepository from '../../repositories/dataCaptureRepository.js';

export async function fetchAll() {
  return await dataCaptureRepository.getAll();
}

export async function fetchById(id) {
  const cap = await dataCaptureRepository.findById(id);
  if (!cap) throw { statusCode: 404, message: 'Data capture record not found' };
  return cap;
}

export async function updateRecord(id, body) {
  const existing = await dataCaptureRepository.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Data capture record not found' };

  const { outstandingAmount, dataQuality, status, financedEmissions, ...extraData } = body;

  const updatedRecord = await dataCaptureRepository.update(id, {
    outstandingAmount: outstandingAmount !== undefined ? outstandingAmount : existing.outstandingAmount,
    dataQuality: dataQuality !== undefined ? dataQuality : existing.dataQuality,
    financedEmissions: financedEmissions !== undefined ? financedEmissions : existing.financedEmissions,
    status: status !== undefined ? status : existing.status,
    extraData: {
      ...(existing.extraData || {}),
      ...extraData
    }
  });

  return updatedRecord;
}

export async function approveRecords(ids) {
  return await dataCaptureRepository.updateStatusMultiple(ids, 'Approved');
}

export async function rejectRecords(ids) {
  return await dataCaptureRepository.updateStatusMultiple(ids, 'Rejected');
}
