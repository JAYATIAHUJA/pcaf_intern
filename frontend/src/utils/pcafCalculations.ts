// Business Loan Emissions Calculations:
export function calculateBusinessLoanEmissionsOption1(
  outstandingAmount: number,
  totalEquity: number,
  totalDebt: number,
  companyEmissions: number
): number {
  const denominator = totalEquity + totalDebt;
  if (denominator <= 0) return 0;
  return (outstandingAmount / denominator) * companyEmissions;
}

export function calculateBusinessLoanEmissionsOption2(
  outstandingAmount: number,
  totalEquity: number,
  totalDebt: number,
  financialMetric: number, // Revenue or EBIT
  sectorEmissionFactor: number // tCO2e / $M
): number {
  const denominator = totalEquity + totalDebt;
  if (denominator <= 0) return 0;
  const estimatedCompanyEmissions = (financialMetric / 1000000) * sectorEmissionFactor;
  return (outstandingAmount / denominator) * estimatedCompanyEmissions;
}

export function calculateBusinessLoanEmissionsOption3(
  outstandingAmount: number,
  sectorAverageIntensity: number // tCO2e / $M asset
): number {
  return (outstandingAmount / 1000000) * sectorAverageIntensity;
}

// Motor Vehicle Emissions Calculations:
export function calculateMotorVehicleEmissionsOption1a(
  outstandingAmount: number,
  vehicleValue: number,
  actualFuelConsumption: number, // Liters or kWh
  fuelEmissionFactor: number // kg CO2e / unit (L or kWh)
): number {
  if (vehicleValue <= 0) return 0;
  const attribution = outstandingAmount / vehicleValue;
  const totalEmissions = (actualFuelConsumption * fuelEmissionFactor) / 1000; // kg to tonnes
  return attribution * totalEmissions;
}

export function calculateMotorVehicleEmissionsOption1b(
  outstandingAmount: number,
  vehicleValue: number,
  actualDistance: number, // km
  emissionFactor: number // g CO2e / km
): number {
  if (vehicleValue <= 0) return 0;
  const attribution = outstandingAmount / vehicleValue;
  const totalEmissions = (actualDistance * emissionFactor) / 1000000; // g to tonnes
  return attribution * totalEmissions;
}

export function calculateMotorVehicleEmissionsOption2a(
  outstandingAmount: number,
  vehicleValue: number,
  estimatedDistance: number, // km
  fuelEfficiency: number, // L / 100km
  fuelEmissionFactor: number // kg CO2e / Liter
): number {
  if (vehicleValue <= 0) return 0;
  const attribution = outstandingAmount / vehicleValue;
  const totalEmissions = (estimatedDistance * (fuelEfficiency / 100) * fuelEmissionFactor) / 1000;
  return attribution * totalEmissions;
}

export function calculateMotorVehicleEmissionsOption2b(
  outstandingAmount: number,
  vehicleValue: number,
  averageDistance: number, // km
  defaultEmissionFactor: number // g CO2e / km
): number {
  if (vehicleValue <= 0) return 0;
  const attribution = outstandingAmount / vehicleValue;
  const totalEmissions = (averageDistance * defaultEmissionFactor) / 1000000; // g to tonnes
  return attribution * totalEmissions;
}

export function calculateMotorVehicleEmissionsOption3a(
  outstandingAmount: number,
  defaultEmissionFactor: number // tCO2e / $M
): number {
  return (outstandingAmount / 1000000) * defaultEmissionFactor;
}
