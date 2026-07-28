export interface MasterDataOption {
  id?: number;
  category: string;
  value: string;
  label: string;
  isActive: boolean;
  sortOrder: number;
}

export type MasterDataMap = Record<string, MasterDataOption[]>;

export const MASTER_DATA_LABELS: Record<string, string> = {
  asset_class: 'Asset Classes',
  country: 'Countries',
  city: 'Cities',
  sector: 'Sectors',
  borrower_type: 'Borrower Types',
  loan_status: 'Loan Statuses',
  company_type: 'Company Types',
  property_category: 'Property Categories',
  property_type: 'Property Types',
  vehicle_type: 'Vehicle Types',
  fuel_type: 'Fuel Types',
  data_quality: 'Data Quality Options'
};

export const DEFAULT_MASTER_DATA: MasterDataMap = {
  asset_class: ['Business Loans', 'Commercial Real Estate', 'Motor Vehicle', 'Mortgage'].map(toOption('asset_class')),
  country: ['Kenya', 'India', 'United States', 'United Kingdom'].map(toOption('country')),
  city: ['Nairobi', 'Mombasa', 'Nakuru', 'Kericho', 'Kiambu', 'Uasin Gishu'].map(toOption('city')),
  sector: [
    'Agriculture, Forestry & Fishing',
    'Manufacturing',
    'Energy & Power',
    'Transportation & Storage',
    'Wholesale & Retail Trade',
    'Construction & Real Estate',
    'Tourism & Hospitality',
    'Information Technology',
    'Residential',
    'Transportation',
    'Oil and Gas'
  ].map(toOption('sector')),
  borrower_type: ['Large Corporate', 'SME', 'MSME', 'Individual', 'Cooperative'].map(toOption('borrower_type')),
  loan_status: ['Active', 'Closed', 'Pending'].map(toOption('loan_status')),
  company_type: ['Private', 'Listed', 'Cooperative'].map(toOption('company_type')),
  property_category: ['Commercial', 'Residential'].map(toOption('property_category')),
  property_type: ['Office Building', 'Retail Mall', 'Mixed-Use Building', 'Apartment', 'Maisonette'].map(toOption('property_type')),
  vehicle_type: ['Passenger Car', 'Light Commercial', 'Commercial Van', 'Minibus'].map(toOption('vehicle_type')),
  fuel_type: ['Petrol', 'Diesel', 'Hybrid', 'Electric'].map(toOption('fuel_type')),
  data_quality: ['1a', '1b', '2a', '2b', '3a'].map(toOption('data_quality'))
};

export const CSV_TEMPLATES = [
  {
    key: 'all_loans',
    label: 'All Loans Master',
    headers: [
      'Loan ID', 'Asset Class', 'Borrower Name', 'Borrower Type', 'Sector', 'City', 'Country', 'Borrower Reg No',
      'Loan Amount', 'Loan Tenure', 'Loan Start Date', 'Loan End Date', 'Loan Status', 'Type Of Company',
      'Property ID', 'Year Built', 'Property Category', 'Property Type', 'Total Floors', 'Property Location', 'Property Value', 'Floor Area Financed', 'Floor Area',
      'Building Name', 'Vehicle Type', 'Vehicle Number', 'Vehicle Make Model', 'Fuel Type', 'Vehicle Value', 'Outstanding Amount', 'Activity Period', 'Data Quality', 'Financed Emissions'
    ],
    sample: ['BL-KE-100', 'Business Loans', 'Sample Borrower Ltd', 'SME', 'Manufacturing', 'Nairobi', 'Kenya', 'PVT-001', '100000', '36', '2026-01-01', '2029-01-01', 'Active', 'Private', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '75000', '2026-07', '2a', '120']
  },
  {
    key: 'business_loans',
    label: 'Business Loans',
    headers: ['Loan ID', 'Asset Class', 'Borrower Name', 'Borrower Type', 'Sector', 'City', 'Country', 'Borrower Reg No', 'Loan Amount', 'Loan Tenure', 'Loan Start Date', 'Loan End Date', 'Loan Status', 'Type Of Company', 'Outstanding Amount', 'Activity Period', 'Data Quality', 'Financed Emissions'],
    sample: ['BL-KE-101', 'Business Loans', 'Apex Components', 'SME', 'Manufacturing', 'Nairobi', 'Kenya', 'PVT-101', '100000', '36', '2026-01-01', '2029-01-01', 'Active', 'Private', '75000', '2026-07', '2a', '120']
  },
  {
    key: 'commercial_real_estate',
    label: 'Commercial Real Estate',
    headers: ['Loan ID', 'Asset Class', 'Borrower Name', 'Borrower Type', 'Sector', 'City', 'Country', 'Borrower Reg No', 'Loan Amount', 'Loan Tenure', 'Loan Start Date', 'Loan End Date', 'Loan Status', 'Property ID', 'Year Built', 'Property Category', 'Property Type', 'Total Floors', 'Property Location', 'Property Value', 'Floor Area Financed', 'Outstanding Amount', 'Activity Period', 'Data Quality', 'Financed Emissions'],
    sample: ['CRE-KE-101', 'Commercial Real Estate', 'Nairobi Office Park Ltd', 'Large Corporate', 'Construction & Real Estate', 'Nairobi', 'Kenya', 'PVT-CRE-101', '2500000', '84', '2026-01-01', '2033-01-01', 'Active', 'PROP-101', '2021', 'Commercial', 'Office Building', '8', 'Westlands', '3300000', '12000', '2100000', '2026-07', '2a', '450']
  },
  {
    key: 'motor_vehicle',
    label: 'Motor Vehicle',
    headers: ['Loan ID', 'Asset Class', 'Borrower Name', 'Borrower Type', 'Sector', 'City', 'Country', 'Borrower Reg No', 'Loan Amount', 'Loan Tenure', 'Loan Start Date', 'Loan End Date', 'Loan Status', 'Vehicle Type', 'Vehicle Number', 'Vehicle Make Model', 'Fuel Type', 'Vehicle Value', 'Outstanding Amount', 'Activity Period', 'Data Quality', 'Financed Emissions'],
    sample: ['MV-KE-101', 'Motor Vehicle', 'ABC Logistics Ltd', 'SME', 'Transportation', 'Nairobi', 'Kenya', 'PVT-MV-101', '52000', '60', '2026-01-01', '2031-01-01', 'Active', 'Light Commercial', 'KDA 101A', 'Isuzu NPR Truck', 'Diesel', '60000', '42000', '2026-07', '2b', '35']
  },
  {
    key: 'mortgage',
    label: 'Mortgage',
    headers: ['Loan ID', 'Asset Class', 'Borrower Name', 'Borrower Type', 'Sector', 'City', 'Country', 'Borrower Reg No', 'Loan Amount', 'Loan Tenure', 'Loan Start Date', 'Loan End Date', 'Loan Status', 'Building Name', 'Year Built', 'Property Type', 'Property Location', 'Property Value', 'Floor Area', 'Outstanding Amount', 'Activity Period', 'Data Quality', 'Financed Emissions'],
    sample: ['MG-KE-101', 'Mortgage', 'Jane Wanjiku', 'Individual', 'Residential', 'Nairobi', 'Kenya', 'ID-KE-101', '145000', '240', '2026-01-01', '2046-01-01', 'Active', 'Sunrise Apartments', '2020', 'Apartment', 'Kilimani', '190000', '95', '132000', '2026-07', '2a', '18']
  },
  {
    key: 'master_data',
    label: 'Master Data',
    headers: ['Category', 'Value', 'Label', 'Is Active', 'Sort Order'],
    sample: ['city', 'Eldoret', 'Eldoret', 'TRUE', '20']
  }
];

export function activeOptionValues(masterData: MasterDataMap, category: string): string[] {
  return (masterData[category] || DEFAULT_MASTER_DATA[category] || [])
    .filter(option => option.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.label.localeCompare(b.label))
    .map(option => option.label || option.value);
}

export function buildCsv(templateKey: string): string {
  const template = CSV_TEMPLATES.find(item => item.key === templateKey) || CSV_TEMPLATES[0];
  return [template.headers, template.sample]
    .map(row => row.map(escapeCsvValue).join(','))
    .join('\n');
}

function toOption(category: string) {
  return (value: string, index: number): MasterDataOption => ({
    category,
    value,
    label: value,
    isActive: true,
    sortOrder: index + 1
  });
}

function escapeCsvValue(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
