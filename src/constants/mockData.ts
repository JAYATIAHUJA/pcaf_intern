// ─── Shared Types ─────────────────────────────────────────────────────────────
export type LoanStatus = 'Active' | 'Closed' | 'Pending';
export type CaptureStatus = 'Pending for Capture' | 'Submitted & Pending' | 'Approved';
export type DQOption = '1a' | '1b' | '2a' | '2b' | '3a';

// ─── Loan Configuration Records ───────────────────────────────────────────────
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

// ─── Capture Activity Records ─────────────────────────────────────────────────
export interface BusinessLoanCapture {
  id: string;
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
}

export interface MotorVehicleCapture {
  id: string;
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

// ─── Mock: Loan Configuration ────────────────────────────────────────────────
export const MOCK_BL_CONFIG: BusinessLoanConfig[] = [
  { loanId: 'BL-KE-001', borrowerName: 'Green Valley Tea Ltd', typeOfCompany: 'Private', sector: 'Agriculture, Forestry & Fishing', borrowerType: 'Large Corporate', city: 'Kericho', country: 'Kenya', borrowerRegNo: 'PVT-KE-784512', loanAmount: 1885000, loanTenure: 60, loanStartDate: '2023-01-01', loanEndDate: '2028-01-01', loanStatus: 'Active' },
  { loanId: 'BL-KE-002', borrowerName: 'Rift Valley Dairy Coop', typeOfCompany: 'Cooperative', sector: 'Agriculture, Forestry & Fishing', borrowerType: 'Cooperative', city: 'Nakuru', country: 'Kenya', borrowerRegNo: 'COOP-KE-221', loanAmount: 1540000, loanTenure: 48, loanStartDate: '2024-03-15', loanEndDate: '2028-03-15', loanStatus: 'Active' },
  { loanId: 'BL-KE-003', borrowerName: 'Nairobi Textiles Ltd', typeOfCompany: 'Private', sector: 'Manufacturing', borrowerType: 'SME', city: 'Nairobi', country: 'Kenya', borrowerRegNo: 'PVT-KE-334567', loanAmount: 960000, loanTenure: 36, loanStartDate: '2023-06-10', loanEndDate: '2026-06-10', loanStatus: 'Active' },
  { loanId: 'BL-KE-004', borrowerName: 'Mombasa Trade Hub', typeOfCompany: 'Private', sector: 'Wholesale & Retail Trade', borrowerType: 'SME', city: 'Mombasa', country: 'Kenya', borrowerRegNo: 'PVT-KE-556789', loanAmount: 730000, loanTenure: 24, loanStartDate: '2024-09-01', loanEndDate: '2026-09-01', loanStatus: 'Active' },
  { loanId: 'BL-KE-005', borrowerName: 'Kenya Logistics Solutions Ltd', typeOfCompany: 'Private', sector: 'Transportation & Storage', borrowerType: 'Large Corporate', city: 'Nairobi', country: 'Kenya', borrowerRegNo: 'PVT-KE-987654', loanAmount: 1385000, loanTenure: 72, loanStartDate: '2022-02-05', loanEndDate: '2028-02-05', loanStatus: 'Active' },
  { loanId: 'BL-KE-006', borrowerName: 'Solar Horizon Energy', typeOfCompany: 'Private', sector: 'Energy & Power', borrowerType: 'SME', city: 'Kiambu', country: 'Kenya', borrowerRegNo: 'PVT-KE-112233', loanAmount: 3462000, loanTenure: 60, loanStartDate: '2023-04-20', loanEndDate: '2028-04-20', loanStatus: 'Active' },
  { loanId: 'BL-KE-007', borrowerName: 'Eldoret Building Supplies', typeOfCompany: 'Private', sector: 'Construction & Real Estate', borrowerType: 'SME', city: 'Uasin Gishu', country: 'Kenya', borrowerRegNo: 'PVT-KE-445566', loanAmount: 962000, loanTenure: 48, loanStartDate: '2023-11-12', loanEndDate: '2027-11-12', loanStatus: 'Active' },
];

export const MOCK_CRE_CONFIG: CommercialREConfig[] = [
  { loanId: 'CRE-KE-001', borrowerName: 'Nairobi Office Park Ltd', borrowerType: 'Large Corporate', sector: 'Construction & Real Estate', propertyId: 'PROP-001', yearBuilt: 2018, propertyCategory: 'Commercial', propertyType: 'Office Building', totalFloors: 12, propertyLocation: 'Westlands, Nairobi', country: 'Kenya', borrowerRegNo: 'PVT-KE-6538', propertyValue: 6538000, floorAreaFinanced: 18, loanAmount: 4769000, loanTenure: 84, loanStartDate: '2022-03-01', loanEndDate: '2029-03-01', loanStatus: 'Active' },
  { loanId: 'CRE-KE-002', borrowerName: 'Mombasa Mall Investors', borrowerType: 'SME', sector: 'Construction & Real Estate', propertyId: 'PROP-002', yearBuilt: 2020, propertyCategory: 'Commercial', propertyType: 'Retail Mall', totalFloors: 4, propertyLocation: 'Mombasa CBD', country: 'Kenya', borrowerRegNo: 'PVT-KE-112', propertyValue: 3231000, floorAreaFinanced: 12, loanAmount: 2423000, loanTenure: 60, loanStartDate: '2023-06-15', loanEndDate: '2028-06-15', loanStatus: 'Active' },
  { loanId: 'CRE-KE-005', borrowerName: 'Green Park Estates Ltd', borrowerType: 'Large Corporate', sector: 'Construction & Real Estate', propertyId: 'PROP-005', yearBuilt: 2022, propertyCategory: 'Commercial', propertyType: 'Mixed-Use Building', totalFloors: 15, propertyLocation: 'Upper Hill, Nairobi', country: 'Kenya', borrowerRegNo: 'PVT-KE-987654', propertyValue: 8846000, floorAreaFinanced: 22500, loanAmount: 6846000, loanTenure: 96, loanStartDate: '2021-04-20', loanEndDate: '2029-04-20', loanStatus: 'Active' },
  { loanId: 'CRE-KE-006', borrowerName: 'Nakuru Office Centre', borrowerType: 'SME', sector: 'Construction & Real Estate', propertyId: 'PROP-006', yearBuilt: 2016, propertyCategory: 'Commercial', propertyType: 'Office Building', totalFloors: 6, propertyLocation: 'Nakuru Town', country: 'Kenya', borrowerRegNo: 'PVT-KE-334', propertyValue: 1385000, floorAreaFinanced: 6, loanAmount: 731000, loanTenure: 36, loanStartDate: '2023-11-12', loanEndDate: '2026-11-12', loanStatus: 'Active' },
];

export const MOCK_MV_CONFIG: MotorVehicleConfig[] = [
  { loanId: 'MV-KE-001', borrowerName: 'John Mwangi', borrowerType: 'Individual', sector: '-', vehicleType: 'Passenger Car', vehicleNumber: 'KBJ 245A', vehicleMakeModel: 'Toyota Corolla 1.8', fuelType: 'Petrol', vehicleValue: 16923, loanAmount: 14231, loanStartDate: '2023-02-01', loanEndDate: '2026-02-01' },
  { loanId: 'MV-KE-002', borrowerName: 'Sarah Chebet', borrowerType: 'Individual', sector: '-', vehicleType: 'Passenger Car', vehicleNumber: 'KCA 781B', vehicleMakeModel: 'Honda Civic', fuelType: 'Petrol', vehicleValue: 21000, loanAmount: 18000, loanStartDate: '2024-05-15', loanEndDate: '2027-05-15' },
  { loanId: 'MV-KE-003', borrowerName: 'ABC Logistics Ltd', borrowerType: 'SME', sector: 'Transportation', vehicleType: 'Light Commercial', vehicleNumber: 'KDB 392C', vehicleMakeModel: 'Isuzu NPR Truck', fuelType: 'Diesel', vehicleValue: 73000, loanAmount: 67000, loanStartDate: '2023-03-10', loanEndDate: '2028-03-10' },
  { loanId: 'MV-KE-004', borrowerName: 'Peter Omondi', borrowerType: 'Individual', sector: '-', vehicleType: 'Passenger Car', vehicleNumber: 'KCE 156D', vehicleMakeModel: 'Suzuki Vitara', fuelType: 'Petrol', vehicleValue: 12000, loanAmount: 10000, loanStartDate: '2023-07-05', loanEndDate: '2026-07-05' },
  { loanId: 'MV-KE-005', borrowerName: 'Green Fleet Kenya', borrowerType: 'Large Corporate', sector: 'Oil and Gas', vehicleType: 'Commercial Van', vehicleNumber: 'KCF 874E', vehicleMakeModel: 'Toyota Hiace', fuelType: 'Diesel', vehicleValue: 101000, loanAmount: 96000, loanStartDate: '2024-04-20', loanEndDate: '2029-04-20' },
  { loanId: 'MV-KE-006', borrowerName: 'Mary Akinyi', borrowerType: 'Individual', sector: '-', vehicleType: 'Passenger Car', vehicleNumber: 'KCG 319F', vehicleMakeModel: 'Hyundai Tucson', fuelType: 'Petrol', vehicleValue: 26000, loanAmount: 23000, loanStartDate: '2023-11-12', loanEndDate: '2026-11-12' },
  { loanId: 'MV-KE-007', borrowerName: 'Nairobi Matatu Sacco', borrowerType: 'Cooperative', sector: 'Transportation', vehicleType: 'Minibus', vehicleNumber: 'KCH 672G', vehicleMakeModel: 'Toyota Coaster', fuelType: 'Diesel', vehicleValue: 60000, loanAmount: 52000, loanStartDate: '2022-06-01', loanEndDate: '2027-06-01' },
];

export const MOCK_MORTGAGE_CONFIG: MortgageConfig[] = [
  { loanId: 'MG-KE-001', borrowerName: 'John Mwangi', borrowerType: 'Individual', sector: 'Residential', buildingName: 'Sunrise Apartments', yearBuilt: 2019, propertyType: 'Apartment', propertyLocation: 'Westlands', country: 'Kenya', borrowerRegNo: 'ID-KE-78833', propertyValue: 185000, floorArea: 95, loanAmount: 142000, loanTenure: 240, loanStartDate: '2023-02-01', loanEndDate: '2043-02-01', loanStatus: 'Active' },
  { loanId: 'MG-KE-002', borrowerName: 'Sarah Chebet', borrowerType: 'Individual', sector: 'Residential', buildingName: 'Valley View Estate', yearBuilt: 2021, propertyType: 'Apartment', propertyLocation: 'Kitengela', country: 'Kenya', borrowerRegNo: 'ID-KE-12445', propertyValue: 165000, floorArea: 85, loanAmount: 128000, loanTenure: 180, loanStartDate: '2024-05-15', loanEndDate: '2039-05-15', loanStatus: 'Active' },
  { loanId: 'MG-KE-003', borrowerName: 'Peter Omondi', borrowerType: 'Individual', sector: 'Residential', buildingName: 'Green Park Maisonettes', yearBuilt: 2018, propertyType: 'Maisonette', propertyLocation: 'Rongai', country: 'Kenya', borrowerRegNo: 'ID-KE-45332', propertyValue: 245000, floorArea: 140, loanAmount: 178000, loanTenure: 300, loanStartDate: '2022-03-10', loanEndDate: '2047-03-10', loanStatus: 'Active' },
  { loanId: 'MG-KE-010', borrowerName: 'Esther Muthoni', borrowerType: 'Individual', sector: 'Residential', buildingName: 'Kilimani Luxury', yearBuilt: 2023, propertyType: 'Apartment', propertyLocation: 'Kilimani, Nairobi', country: 'Kenya', borrowerRegNo: 'ID-KE-667788', propertyValue: 325000, floorArea: 135, loanAmount: 245000, loanTenure: 300, loanStartDate: '2025-01-20', loanEndDate: '2050-01-20', loanStatus: 'Active' },
  { loanId: 'MG-KE-013', borrowerName: 'Daniel Otieno', borrowerType: 'Individual', sector: 'Residential', buildingName: 'Parklands Heights', yearBuilt: 2019, propertyType: 'Apartment', propertyLocation: 'Parklands', country: 'Kenya', borrowerRegNo: 'ID-KE-223344', propertyValue: 192000, floorArea: 88, loanAmount: 148000, loanTenure: 240, loanStartDate: '2023-04-15', loanEndDate: '2043-04-15', loanStatus: 'Active' },
];

// ─── Capture Activity Mock Data ───────────────────────────────────────────────
export const MOCK_BL_CAPTURE: BusinessLoanCapture[] = [
  { id: 'cap-bl-001', activityPeriod: 'Jun 2026', loanId: 'BL-KE-005', borrowerName: 'Kenya Logistics Solutions Ltd', typeOfCompany: 'Private', sector: 'Transportation & Storage', city: 'Nairobi', country: 'Kenya', loanAmount: 1385000, totalEquity: 7077000, totalDebt: 5000000, outstandingAmount: 0, dataQuality: null, financedEmissions: 0, status: 'Pending for Capture' },
  { id: 'cap-bl-002', activityPeriod: 'Jun 2026', loanId: 'BL-KE-014', borrowerName: 'Eldoret Building Supplies', typeOfCompany: 'Private', sector: 'Construction & Real Estate', city: 'Eldoret', country: 'Kenya', loanAmount: 962000, totalEquity: 3200000, totalDebt: 1538000, outstandingAmount: 0, dataQuality: null, financedEmissions: 0, status: 'Pending for Capture' },
  { id: 'cap-bl-003', activityPeriod: 'Jun 2026', loanId: 'BL-KE-015', borrowerName: 'Green Valley Tea Ltd', typeOfCompany: 'Private', sector: 'Agriculture, Forestry & Fishing', city: 'Kericho', country: 'Kenya', loanAmount: 1885000, totalEquity: 9230000, totalDebt: 21538000, outstandingAmount: 1540000, dataQuality: '2a', financedEmissions: 5940, status: 'Submitted & Pending' },
  { id: 'cap-bl-004', activityPeriod: 'Jun 2026', loanId: 'BL-KE-018', borrowerName: 'Nairobi Textiles Ltd', typeOfCompany: 'Private', sector: 'Manufacturing', city: 'Nairobi', country: 'Kenya', loanAmount: 960000, totalEquity: 4200000, totalDebt: 6923000, outstandingAmount: 0, dataQuality: null, financedEmissions: 0, status: 'Pending for Capture' },
  { id: 'cap-bl-005', activityPeriod: 'Jun 2026', loanId: 'BL-KE-019', borrowerName: 'Mombasa Trade Hub', typeOfCompany: 'Private', sector: 'Wholesale & Retail Trade', city: 'Mombasa', country: 'Kenya', loanAmount: 730000, totalEquity: 1900000, totalDebt: 2154000, outstandingAmount: 0, dataQuality: null, financedEmissions: 0, status: 'Pending for Capture' },
  { id: 'cap-bl-006', activityPeriod: 'Jun 2026', loanId: 'BL-KE-023', borrowerName: 'Solar Horizon Energy', typeOfCompany: 'Private', sector: 'Energy & Power', city: 'Kiambu', country: 'Kenya', loanAmount: 3462000, totalEquity: 7700000, totalDebt: 1538000, outstandingAmount: 1280000, dataQuality: '1a', financedEmissions: 1280, status: 'Submitted & Pending' },
  { id: 'cap-bl-007', activityPeriod: 'Jun 2026', loanId: 'BL-KE-024', borrowerName: 'Agriculture Forestry Co', typeOfCompany: 'Cooperative', sector: 'Agriculture, Forestry & Fishing', city: 'Meru', country: 'Kenya', loanAmount: 2308000, totalEquity: 8000000, totalDebt: 1923000, outstandingAmount: 9231000, dataQuality: '2b', financedEmissions: 4180, status: 'Submitted & Pending' },
  { id: 'cap-bl-008', activityPeriod: 'Jun 2026', loanId: 'BL-KE-025', borrowerName: 'Agriculture Forestry Naivasha', typeOfCompany: 'Cooperative', sector: 'Agriculture, Forestry & Fishing', city: 'Naivasha', country: 'Kenya', loanAmount: 1692000, totalEquity: 6000000, totalDebt: 1385000, outstandingAmount: 6923000, dataQuality: '3a', financedEmissions: 3450, status: 'Submitted & Pending' },
];

export const MOCK_MV_CAPTURE: MotorVehicleCapture[] = [
  { id: 'cap-mv-001', activityPeriod: 'Apr 2025', loanId: 'MV-KE-001', borrowerType: 'Individual', vehicleType: 'Passenger Car', vehicleMakeModel: 'Toyota Corolla 1.8', yearOfManufacture: 2022, outstandingAmount: 11850, dataQuality: '1a', financedEmissions: 4.20, status: 'Submitted & Pending' },
  { id: 'cap-mv-002', activityPeriod: 'Apr 2025', loanId: 'MV-KE-002', borrowerType: 'Individual', vehicleType: 'Passenger Car', vehicleMakeModel: 'Honda Civic', yearOfManufacture: 2021, outstandingAmount: 15200, dataQuality: '1a', financedEmissions: 5.80, status: 'Submitted & Pending' },
  { id: 'cap-mv-003', activityPeriod: 'Apr 2025', loanId: 'MV-KE-003', borrowerType: 'SME', vehicleType: 'Light Commercial', vehicleMakeModel: 'Isuzu NPR Truck', yearOfManufacture: 2020, outstandingAmount: 62000, dataQuality: '1b', financedEmissions: 19.70, status: 'Submitted & Pending' },
  { id: 'cap-mv-004', activityPeriod: 'Apr 2025', loanId: 'MV-KE-004', borrowerType: 'Individual', vehicleType: 'Passenger Car', vehicleMakeModel: 'Suzuki Vitara', yearOfManufacture: 2022, outstandingAmount: 9800, dataQuality: '1a', financedEmissions: 7.10, status: 'Submitted & Pending' },
  { id: 'cap-mv-005', activityPeriod: 'Apr 2025', loanId: 'MV-KE-005', borrowerType: 'Large Corporate', vehicleType: 'Commercial Van', vehicleMakeModel: 'Toyota Hiace', yearOfManufacture: 2023, outstandingAmount: 91180, dataQuality: '2a', financedEmissions: 1.20, status: 'Submitted & Pending' },
  { id: 'cap-mv-006', activityPeriod: 'Apr 2025', loanId: 'MV-KE-006', borrowerType: 'Individual', vehicleType: 'Passenger Car', vehicleMakeModel: 'Hyundai Tucson', yearOfManufacture: 2022, outstandingAmount: 21800, dataQuality: '2b', financedEmissions: 6.50, status: 'Submitted & Pending' },
  { id: 'cap-mv-011', activityPeriod: 'Apr 2025', loanId: 'MV-KE-011', borrowerType: 'Individual', vehicleType: 'Passenger Car', vehicleMakeModel: 'Toyota Corolla', yearOfManufacture: 2021, outstandingAmount: 13200, dataQuality: '1a', financedEmissions: 4.50, status: 'Submitted & Pending' },
  { id: 'cap-mv-012', activityPeriod: 'Apr 2025', loanId: 'MV-KE-012', borrowerType: 'Individual', vehicleType: 'Motorcycle', vehicleMakeModel: 'TVS Apache', yearOfManufacture: 2022, outstandingAmount: 950, dataQuality: '3a', financedEmissions: 1.80, status: 'Submitted & Pending' },
  { id: 'cap-mv-014', activityPeriod: 'Apr 2025', loanId: 'MV-KE-014', borrowerType: 'Individual', vehicleType: 'Passenger Car', vehicleMakeModel: 'Volkswagen Polo', yearOfManufacture: 2021, outstandingAmount: 13800, dataQuality: '1b', financedEmissions: 5.40, status: 'Submitted & Pending' },
];

export const MOCK_CRE_CAPTURE: CommercialRECapture[] = [
  { id: 'cap-cre-001', activityPeriod: 'Mar 2001', loanId: 'CRE-KE-005', borrowerName: 'Green Park Estates Ltd', sector: 'Construction & Real Estate', propertyLocation: 'Upper Hill, Nairobi', loanAmount: 6846000, outstandingAmount: 5769000, financedEmissions: 1.00, dataQuality: '1b', status: 'Submitted & Pending' },
  { id: 'cap-cre-002', activityPeriod: 'Mar 2001', loanId: 'CRE-KE-006', borrowerName: 'Nakuru Office Centre', sector: 'Construction & Real Estate', propertyLocation: 'Nakuru Town', loanAmount: 731000, outstandingAmount: 615000, financedEmissions: 435.00, dataQuality: '2a', status: 'Submitted & Pending' },
  { id: 'cap-cre-003', activityPeriod: 'Mar 2001', loanId: 'CRE-KE-007', borrowerName: 'Coast Commercial Ltd', sector: 'Construction & Real Estate', propertyLocation: 'Diani, Kenya', loanAmount: 2923000, outstandingAmount: 2538000, financedEmissions: 967.00, dataQuality: '1a', status: 'Submitted & Pending' },
  { id: 'cap-cre-004', activityPeriod: 'Mar 2001', loanId: 'CRE-KE-009', borrowerName: 'Capital Office Ltd', sector: 'Construction & Real Estate', propertyLocation: 'Kilimani, Nairobi', loanAmount: 4462000, outstandingAmount: 3846000, financedEmissions: 1.00, dataQuality: '1b', status: 'Submitted & Pending' },
  { id: 'cap-cre-005', activityPeriod: 'Mar 2001', loanId: 'CRE-KE-010', borrowerName: 'Rift Valley Commercial', sector: 'Construction & Real Estate', propertyLocation: 'Eldoret', loanAmount: 1885000, outstandingAmount: 1615000, financedEmissions: 712.00, dataQuality: '2b', status: 'Submitted & Pending' },
  { id: 'cap-cre-006', activityPeriod: 'Mar 2001', loanId: 'CRE-KE-013', borrowerName: 'Machakos Warehouse', sector: 'Construction & Real Estate', propertyLocation: 'Machakos', loanAmount: 2308000, outstandingAmount: 2000000, financedEmissions: 980.00, dataQuality: '1a', status: 'Submitted & Pending' },
];

export const MOCK_MORTGAGE_CAPTURE: MortgageCapture[] = [
  { id: 'cap-mg-001', activityPeriod: 'Mar 2001', loanId: 'MG-KE-010', borrowerName: 'Esther Muthoni', borrowerType: 'Individual', floorArea: 135, loanAmount: 245000, outstandingAmount: 205000, financedEmissions: 4.28, dataQuality: '1b', status: 'Submitted & Pending' },
  { id: 'cap-mg-002', activityPeriod: 'Mar 2001', loanId: 'MG-KE-013', borrowerName: 'Daniel Otieno', borrowerType: 'Individual', floorArea: 88, loanAmount: 148000, outstandingAmount: 125000, financedEmissions: 2.08, dataQuality: '1b', status: 'Submitted & Pending' },
  { id: 'cap-mg-003', activityPeriod: 'Mar 2001', loanId: 'MG-KE-023', borrowerName: 'Thomas Kariuki', borrowerType: 'Individual', floorArea: 102, loanAmount: 122000, outstandingAmount: 102000, financedEmissions: 2.48, dataQuality: '1b', status: 'Submitted & Pending' },
];

// ─── Dashboard Data ───────────────────────────────────────────────────────────
export const DASHBOARD_KPIS = {
  totalFinancedEmission: 268450,
  yoyChange: -8,
  portfolioCoverage: 82,
  waci: 245,
  avgDataQuality: 3.1,
};

export const ASSET_CLASS_EMISSION = [
  { assetClass: 'Business Loans & Unlisted Equity', financedEmissions: 188200, percentage: 70.10 },
  { assetClass: 'Commercial Real Estate', financedEmissions: 39500, percentage: 14.70 },
  { assetClass: 'Motor Vehicle Loans', financedEmissions: 20450, percentage: 7.60 },
  { assetClass: 'Mortgages', financedEmissions: 12300, percentage: 4.60 },
  { assetClass: 'Project Finance', financedEmissions: 5800, percentage: 2.20 },
  { assetClass: 'Others', financedEmissions: 2200, percentage: 0.80 },
];

export const SECTOR_EMISSIONS = [
  { rank: 1, sector: 'Manufacturing', financedEmissions: 112150, pctTotal: 41.80, avgDQ: 3.4, yoyTrend: '+6%' },
  { rank: 2, sector: 'Agriculture, Forestry & Fishing', financedEmissions: 62450, pctTotal: 23.30, avgDQ: 2.9, yoyTrend: '+4%' },
  { rank: 3, sector: 'Energy & Power', financedEmissions: 34800, pctTotal: 13.00, avgDQ: 2.3, yoyTrend: '+12%' },
  { rank: 4, sector: 'Transportation & Storage', financedEmissions: 24650, pctTotal: 9.20, avgDQ: 3.1, yoyTrend: 'Stable' },
  { rank: 5, sector: 'Wholesale & Retail Trade', financedEmissions: 17200, pctTotal: 6.40, avgDQ: 3.8, yoyTrend: '+8%' },
];

export const TOP10_HIGHEST = [
  { rank: 1, loanId: 'BL-KE-056', borrowerName: 'Rift Valley Steel Mills Ltd', sector: 'Manufacturing', financedEmissions: 14850, dq: 1, assetClass: 'Business Loans' },
  { rank: 2, loanId: 'BL-KE-089', borrowerName: 'Kenya Power Generation Ltd', sector: 'Energy & Power', financedEmissions: 12450, dq: 2, assetClass: 'Business Loans' },
  { rank: 3, loanId: 'BL-KE-112', borrowerName: 'Green Valley Tea Processing Ltd', sector: 'Agriculture, Forestry & Fishing', financedEmissions: 9780, dq: 2, assetClass: 'Business Loans' },
  { rank: 4, loanId: 'CRE-KE-034', borrowerName: 'Nairobi Industrial Park Ltd', sector: 'Construction & Real Estate', financedEmissions: 8920, dq: 2, assetClass: 'Commercial Real Estate' },
  { rank: 5, loanId: 'BL-KE-067', borrowerName: 'East Africa Cement Ltd', sector: 'Manufacturing', financedEmissions: 7850, dq: 1, assetClass: 'Business Loans' },
  { rank: 6, loanId: 'BL-KE-145', borrowerName: 'Mombasa Refinery Services', sector: 'Energy & Power', financedEmissions: 6820, dq: 3, assetClass: 'Business Loans' },
  { rank: 7, loanId: 'BL-KE-078', borrowerName: 'Lake Basin Sugar Mills', sector: 'Agriculture, Forestry & Fishing', financedEmissions: 5940, dq: 4, assetClass: 'Business Loans' },
  { rank: 8, loanId: 'CRE-KE-019', borrowerName: 'Horizon Logistics Hub Ltd', sector: 'Construction & Real Estate', financedEmissions: 5210, dq: 3, assetClass: 'Commercial Real Estate' },
  { rank: 9, loanId: 'MV-KE-142', borrowerName: 'ABC Heavy Fleet Ltd', sector: 'Transportation & Storage', financedEmissions: 4850, dq: 2, assetClass: 'Motor Vehicle Loans' },
  { rank: 10, loanId: 'BL-KE-203', borrowerName: 'Coastal Fertilizer Industries', sector: 'Manufacturing', financedEmissions: 4620, dq: 3, assetClass: 'Business Loans' },
];

export const TOP10_LOWEST = [
  { rank: 1, loanId: 'MV-KE-278', borrowerName: 'Alice Wanjiku', sector: 'Transportation & Storage', financedEmissions: 18, dq: 3, assetClass: 'Motor Vehicle Loans' },
  { rank: 2, loanId: 'MV-KE-315', borrowerName: 'Peter Kipchoge', sector: 'Transportation & Storage', financedEmissions: 24, dq: 2, assetClass: 'Motor Vehicle Loans' },
  { rank: 3, loanId: 'MV-KE-192', borrowerName: 'Jane Muthoni', sector: 'Transportation & Storage', financedEmissions: 31, dq: 3, assetClass: 'Motor Vehicle Loans' },
  { rank: 4, loanId: 'BL-KE-421', borrowerName: 'Solar Solutions Kenya Ltd', sector: 'Energy & Power', financedEmissions: 45, dq: 1, assetClass: 'Business Loans' },
  { rank: 5, loanId: 'MV-KE-267', borrowerName: 'David Otieno', sector: 'Transportation & Storage', financedEmissions: 52, dq: 4, assetClass: 'Motor Vehicle Loans' },
  { rank: 6, loanId: 'BL-KE-389', borrowerName: 'EcoClean Waste Management Ltd', sector: 'Wholesale & Retail Trade', financedEmissions: 68, dq: 2, assetClass: 'Business Loans' },
  { rank: 7, loanId: 'MV-KE-334', borrowerName: 'Mary Chelangat', sector: 'Transportation & Storage', financedEmissions: 75, dq: 3, assetClass: 'Motor Vehicle Loans' },
  { rank: 8, loanId: 'BL-KE-456', borrowerName: 'GreenTech IT Solutions Ltd', sector: 'Wholesale & Retail Trade', financedEmissions: 82, dq: 2, assetClass: 'Business Loans' },
  { rank: 9, loanId: 'MV-KE-289', borrowerName: 'Samuel Njoroge', sector: 'Transportation & Storage', financedEmissions: 89, dq: 3, assetClass: 'Motor Vehicle Loans' },
  { rank: 10, loanId: 'BL-KE-512', borrowerName: 'Kisumu Organic Farmers Coop', sector: 'Agriculture, Forestry & Fishing', financedEmissions: 95, dq: 4, assetClass: 'Business Loans' },
];

export const YEARLY_TREND = [
  { year: 'FY 2023', financedEmissions: 249800 },
  { year: 'FY 2024', financedEmissions: 278650 },
  { year: 'FY 2025', financedEmissions: 268450 },
];

export const YEARLY_COMPARISON = [
  { assetClass: 'Business Loans & Unlisted Equity', fy2023: 172500, fy2024: 198450, fy2025: 188200 },
  { assetClass: 'Commercial Real Estate', fy2023: 32800, fy2024: 41200, fy2025: 39500 },
  { assetClass: 'Motor Vehicle Loans', fy2023: 18250, fy2024: 22150, fy2025: 20450 },
  { assetClass: 'Mortgages', fy2023: 11200, fy2024: 13450, fy2025: 12300 },
];

export const SECTOR_HIGHEST = [
  { sector: 'Manufacturing', emissions: 27120 },
  { sector: 'Energy & Power', emissions: 19270 },
  { sector: 'Agriculture, Forestry & Fishing', emissions: 15720 },
  { sector: 'Construction & Real Estate', emissions: 14130 },
];

export const SECTOR_LOWEST = [
  { sector: 'Energy & Power', emissions: 45 },
  { sector: 'Agriculture, Forestry & Fishing', emissions: 95 },
  { sector: 'Wholesale & Retail Trade', emissions: 150 },
  { sector: 'Transportation & Storage', emissions: 289 },
];

export const DONUT_ASSET_COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#607D8B'];
export const DONUT_SECTOR_COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#607D8B'];

export function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n.toFixed(0)}`;
}
