const MASTER_DATA = {
  asset_class: ['Business Loans', 'Commercial Real Estate', 'Motor Vehicle', 'Mortgage'],
  country: ['Kenya', 'India', 'United States', 'United Kingdom'],
  city: ['Nairobi', 'Mombasa', 'Nakuru', 'Kericho', 'Kiambu', 'Uasin Gishu', 'Kitengela', 'Westlands', 'Kilimani'],
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
  ],
  borrower_type: ['Large Corporate', 'SME', 'MSME', 'Individual', 'Cooperative'],
  loan_status: ['Active', 'Closed', 'Pending'],
  company_type: ['Private', 'Listed', 'Cooperative'],
  property_category: ['Commercial', 'Residential'],
  property_type: ['Office Building', 'Retail Mall', 'Mixed-Use Building', 'Apartment', 'Maisonette'],
  vehicle_type: ['Passenger Car', 'Light Commercial', 'Commercial Van', 'Minibus'],
  fuel_type: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
  data_quality: ['1a', '1b', '2a', '2b', '3a']
};

export async function seed(client) {
  console.log('Upserting master data options...');
  for (const [category, values] of Object.entries(MASTER_DATA)) {
    for (const [index, value] of values.entries()) {
      await client.query(
        `INSERT INTO master_data(category, value, label, is_active, sort_order)
         VALUES($1, $2, $3, TRUE, $4)
         ON CONFLICT (category, value) DO UPDATE SET
           label = EXCLUDED.label,
           sort_order = EXCLUDED.sort_order,
           updated_at = CURRENT_TIMESTAMP`,
        [category, value, value, index + 1]
      );
    }
  }
}
