export type LoanStatus = 'Active' | 'Closed' | 'Pending';
export type CaptureStatus = 'Pending for Capture' | 'Submitted & Pending' | 'Approved' | 'Rejected';
export type DQOption = '1a' | '1b' | '2a' | '2b' | '3a';
export type DataQualityScore = 1 | 2 | 3 | 4 | 5;

export interface BusinessLoanConfig {
  loanId: string;
  borrowerName: string;
  typeOfCompany: 'Private' | 'Listed' | 'Cooperative';
  sector: string;
  borrowerType: 'Large Corporate' | 'SME' | 'MSME' | 'Individual' | 'Cooperative';
  city: string;
  country: string;
  borrowerRegNo: string;
  loanAmount: number;
  loanTenure: number;
  loanStartDate: string;
  loanEndDate: string;
  loanStatus: LoanStatus;
}

export interface CommercialREConfig {
  loanId: string;
  borrowerName: string;
  borrowerType: string;
  sector: string;
  propertyId: string;
  yearBuilt: number;
  propertyCategory: string;
  propertyType: string;
  totalFloors: number;
  propertyLocation: string;
  country: string;
  borrowerRegNo: string;
  propertyValue: number;
  floorAreaFinanced: number;
  loanAmount: number;
  loanTenure: number;
  loanStartDate: string;
  loanEndDate: string;
  loanStatus: LoanStatus;
}

export interface MotorVehicleConfig {
  loanId: string;
  borrowerName: string;
  borrowerType: string;
  sector: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicleMakeModel: string;
  fuelType: string;
  vehicleValue: number;
  loanAmount: number;
  loanStartDate: string;
  loanEndDate: string;
}

export interface MortgageConfig {
  loanId: string;
  borrowerName: string;
  borrowerType: string;
  sector: string;
  buildingName: string;
  yearBuilt: number;
  propertyType: string;
  propertyLocation: string;
  country: string;
  borrowerRegNo: string;
  propertyValue: number;
  floorArea: number;
  loanAmount: number;
  loanTenure: number;
  loanStartDate: string;
  loanEndDate: string;
  loanStatus: LoanStatus;
}

export interface BusinessLoanCapture {
  id: string | number;
  activityPeriod: string;
  loanId: string;
  borrowerName: string;
  typeOfCompany: string;
  sector: string;
  city: string;
  country: string;
  loanAmount: number;
  totalEquity: number;
  totalDebt: number;
  outstandingAmount: number;
  dataQuality: DQOption | null;
  financedEmissions: number;
  status: CaptureStatus;
  assetClass?: string;
  borrowerType?: string;
  borrowerRegNo?: string;
  loanTenure?: number;
  loanStartDate?: string;
  loanEndDate?: string;
  scope1Emissions?: string;
  scope2Emissions?: string;
  scope3Emissions?: string;
  companyRevenue?: string;
  companyEbit?: string;
  sectorEmissionIntensity?: string;
  sectorAverageIntensity?: string;
}

export interface MotorVehicleCapture {
  id: string | number;
  activityPeriod: string;
  loanId: string;
  borrowerType: string;
  vehicleType: string;
  vehicleMakeModel: string;
  yearOfManufacture: number;
  outstandingAmount: number;
  dataQuality: DQOption | null;
  financedEmissions: number;
  status: CaptureStatus;
  assetClass?: string;
  borrowerName?: string;
  fuelType?: string;
  vehicleNumber?: string;
  originalValue?: number;
  loanAmount?: number;
  loanStartDate?: string;
  loanEndDate?: string;
  actualFuelConsumption?: string;
  fuelEmissionFactor?: string;
  actualDistance?: string;
  emissionFactor?: string;
  estimatedDistance?: string;
  fuelEfficiency?: string;
  averageDistance?: string;
  defaultEmissionFactor?: string;
  defaultIntensityFactor?: string;
}

export interface CommercialRECapture {
  id: string;
  activityPeriod: string;
  loanId: string;
  borrowerName: string;
  sector: string;
  propertyLocation: string;
  loanAmount: number;
  outstandingAmount: number;
  financedEmissions: number;
  dataQuality: DQOption | null;
  status: CaptureStatus;
}

export interface MortgageCapture {
  id: string;
  activityPeriod: string;
  loanId: string;
  borrowerName: string;
  borrowerType: string;
  floorArea: number;
  loanAmount: number;
  outstandingAmount: number;
  financedEmissions: number;
  dataQuality: DQOption | null;
  status: CaptureStatus;
}
