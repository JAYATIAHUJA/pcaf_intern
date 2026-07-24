export async function seed(client) {
  const configsCheck = await client.query('SELECT COUNT(*) FROM loan_configurations');
  if (parseInt(configsCheck.rows[0].count) === 0) {
    console.log('Seeding initial loan configurations...');
    const seededConfigs = [
      // Business Loans
      { loanId: 'BL-KE-001', assetClass: 'Business Loans', borrowerName: 'Green Valley Tea Ltd', borrowerType: 'Large Corporate', sector: 'Agriculture, Forestry & Fishing', city: 'Kericho', country: 'Kenya', borrowerRegNo: 'PVT-KE-784512', loanAmount: 1885000, loanTenure: 60, loanStartDate: '2023-01-01', loanEndDate: '2028-01-01', loanStatus: 'Active', extraData: { typeOfCompany: 'Private' } },
      { loanId: 'BL-KE-002', assetClass: 'Business Loans', borrowerName: 'Rift Valley Dairy Coop', borrowerType: 'Cooperative', sector: 'Agriculture, Forestry & Fishing', city: 'Nakuru', country: 'Kenya', borrowerRegNo: 'COOP-KE-221', loanAmount: 1540000, loanTenure: 48, loanStartDate: '2024-03-15', loanEndDate: '2028-03-15', loanStatus: 'Active', extraData: { typeOfCompany: 'Cooperative' } },
      { loanId: 'BL-KE-003', assetClass: 'Business Loans', borrowerName: 'Nairobi Textiles Ltd', borrowerType: 'SME', sector: 'Manufacturing', city: 'Nairobi', country: 'Kenya', borrowerRegNo: 'PVT-KE-334567', loanAmount: 960000, loanTenure: 36, loanStartDate: '2023-06-10', loanEndDate: '2026-06-10', loanStatus: 'Active', extraData: { typeOfCompany: 'Private' } },
      { loanId: 'BL-KE-004', assetClass: 'Business Loans', borrowerName: 'Mombasa Trade Hub', borrowerType: 'SME', sector: 'Wholesale & Retail Trade', city: 'Mombasa', country: 'Kenya', borrowerRegNo: 'PVT-KE-556789', loanAmount: 730000, loanTenure: 24, loanStartDate: '2024-09-01', loanEndDate: '2026-09-01', loanStatus: 'Active', extraData: { typeOfCompany: 'Private' } },
      { loanId: 'BL-KE-005', assetClass: 'Business Loans', borrowerName: 'Kenya Logistics Solutions Ltd', borrowerType: 'Large Corporate', sector: 'Transportation & Storage', city: 'Nairobi', country: 'Kenya', borrowerRegNo: 'PVT-KE-987654', loanAmount: 1385000, loanTenure: 72, loanStartDate: '2022-02-05', loanEndDate: '2028-02-05', loanStatus: 'Active', extraData: { typeOfCompany: 'Private' } },
      { loanId: 'BL-KE-006', assetClass: 'Business Loans', borrowerName: 'Solar Horizon Energy', borrowerType: 'SME', sector: 'Energy & Power', city: 'Kiambu', country: 'Kenya', borrowerRegNo: 'PVT-KE-112233', loanAmount: 3462000, loanTenure: 60, loanStartDate: '2023-04-20', loanEndDate: '2028-04-20', loanStatus: 'Active', extraData: { typeOfCompany: 'Private' } },
      { loanId: 'BL-KE-007', assetClass: 'Business Loans', borrowerName: 'Eldoret Building Supplies', borrowerType: 'SME', sector: 'Construction & Real Estate', city: 'Uasin Gishu', country: 'Kenya', borrowerRegNo: 'PVT-KE-445566', loanAmount: 962000, loanTenure: 48, loanStartDate: '2023-11-12', loanEndDate: '2027-11-12', loanStatus: 'Active', extraData: { typeOfCompany: 'Private' } },

      // Commercial Real Estate
      { loanId: 'CRE-KE-001', assetClass: 'Commercial Real Estate', borrowerName: 'Nairobi Office Park Ltd', borrowerType: 'Large Corporate', sector: 'Construction & Real Estate', city: 'Nairobi', country: 'Kenya', borrowerRegNo: 'PVT-KE-6538', loanAmount: 4769000, loanTenure: 84, loanStartDate: '2022-03-01', loanEndDate: '2029-03-01', loanStatus: 'Active', extraData: { propertyId: 'PROP-001', yearBuilt: 2018, propertyCategory: 'Commercial', propertyType: 'Office Building', totalFloors: 12, propertyLocation: 'Westlands, Nairobi', propertyValue: 6538000, floorAreaFinanced: 18 } },
      { loanId: 'CRE-KE-002', assetClass: 'Commercial Real Estate', borrowerName: 'Mombasa Mall Investors', borrowerType: 'SME', sector: 'Construction & Real Estate', city: 'Mombasa', country: 'Kenya', borrowerRegNo: 'PVT-KE-112', loanAmount: 2423000, loanTenure: 60, loanStartDate: '2023-06-15', loanEndDate: '2028-06-15', loanStatus: 'Active', extraData: { propertyId: 'PROP-002', yearBuilt: 2020, propertyCategory: 'Commercial', propertyType: 'Retail Mall', totalFloors: 4, propertyLocation: 'Mombasa CBD', propertyValue: 3231000, floorAreaFinanced: 12 } },
      { loanId: 'CRE-KE-005', assetClass: 'Commercial Real Estate', borrowerName: 'Green Park Estates Ltd', borrowerType: 'Large Corporate', sector: 'Construction & Real Estate', city: 'Nairobi', country: 'Kenya', borrowerRegNo: 'PVT-KE-987654', loanAmount: 6846000, loanTenure: 96, loanStartDate: '2021-04-20', loanEndDate: '2029-04-20', loanStatus: 'Active', extraData: { propertyId: 'PROP-005', yearBuilt: 2022, propertyCategory: 'Commercial', propertyType: 'Mixed-Use Building', totalFloors: 15, propertyLocation: 'Upper Hill, Nairobi', propertyValue: 8846000, floorAreaFinanced: 22500 } },
      { loanId: 'CRE-KE-006', assetClass: 'Commercial Real Estate', borrowerName: 'Nakuru Office Centre', borrowerType: 'SME', sector: 'Construction & Real Estate', city: 'Nakuru', country: 'Kenya', borrowerRegNo: 'PVT-KE-334', loanAmount: 731000, loanTenure: 36, loanStartDate: '2023-11-12', loanEndDate: '2026-11-12', loanStatus: 'Active', extraData: { propertyId: 'PROP-006', yearBuilt: 2016, propertyCategory: 'Commercial', propertyType: 'Office Building', totalFloors: 6, propertyLocation: 'Nakuru Town', propertyValue: 1385000, floorAreaFinanced: 6 } },

      // Motor Vehicle
      { loanId: 'MV-KE-001', assetClass: 'Motor Vehicle', borrowerName: 'John Mwangi', borrowerType: 'Individual', sector: '-', city: '', country: 'Kenya', borrowerRegNo: '', loanAmount: 14231, loanTenure: 36, loanStartDate: '2023-02-01', loanEndDate: '2026-02-01', loanStatus: 'Active', extraData: { vehicleType: 'Passenger Car', vehicleNumber: 'KBJ 245A', vehicleMakeModel: 'Toyota Corolla 1.8', fuelType: 'Petrol', vehicleValue: 16923 } },
      { loanId: 'MV-KE-002', assetClass: 'Motor Vehicle', borrowerName: 'Sarah Chebet', borrowerType: 'Individual', sector: '-', city: '', country: 'Kenya', borrowerRegNo: '', loanAmount: 18000, loanTenure: 36, loanStartDate: '2024-05-15', loanEndDate: '2027-05-15', loanStatus: 'Active', extraData: { vehicleType: 'Passenger Car', vehicleNumber: 'KCA 781B', vehicleMakeModel: 'Honda Civic', fuelType: 'Petrol', vehicleValue: 21000 } },
      { loanId: 'MV-KE-003', assetClass: 'Motor Vehicle', borrowerName: 'ABC Logistics Ltd', borrowerType: 'SME', sector: 'Transportation', city: '', country: 'Kenya', borrowerRegNo: '', loanAmount: 67000, loanTenure: 60, loanStartDate: '2023-03-10', loanEndDate: '2028-03-10', loanStatus: 'Active', extraData: { vehicleType: 'Light Commercial', vehicleNumber: 'KDB 392C', vehicleMakeModel: 'Isuzu NPR Truck', fuelType: 'Diesel', vehicleValue: 73000 } },
      { loanId: 'MV-KE-004', assetClass: 'Motor Vehicle', borrowerName: 'Peter Omondi', borrowerType: 'Individual', sector: '-', city: '', country: 'Kenya', borrowerRegNo: '', loanAmount: 10000, loanTenure: 36, loanStartDate: '2023-07-05', loanEndDate: '2026-07-05', loanStatus: 'Active', extraData: { vehicleType: 'Passenger Car', vehicleNumber: 'KCE 156D', vehicleMakeModel: 'Suzuki Vitara', fuelType: 'Petrol', vehicleValue: 12000 } },
      { loanId: 'MV-KE-005', assetClass: 'Motor Vehicle', borrowerName: 'Green Fleet Kenya', borrowerType: 'Large Corporate', sector: 'Oil and Gas', city: '', country: 'Kenya', borrowerRegNo: '', loanAmount: 96000, loanTenure: 60, loanStartDate: '2024-04-20', loanEndDate: '2029-04-20', loanStatus: 'Active', extraData: { vehicleType: 'Commercial Van', vehicleNumber: 'KCF 874E', vehicleMakeModel: 'Toyota Hiace', fuelType: 'Diesel', vehicleValue: 101000 } },
      { loanId: 'MV-KE-006', assetClass: 'Motor Vehicle', borrowerName: 'Mary Akinyi', borrowerType: 'Individual', sector: '-', city: '', country: 'Kenya', borrowerRegNo: '', loanAmount: 23000, loanTenure: 36, loanStartDate: '2023-11-12', loanEndDate: '2026-11-12', loanStatus: 'Active', extraData: { vehicleType: 'Passenger Car', vehicleNumber: 'KCG 319F', vehicleMakeModel: 'Hyundai Tucson', fuelType: 'Petrol', vehicleValue: 26000 } },
      { loanId: 'MV-KE-007', assetClass: 'Motor Vehicle', borrowerName: 'Nairobi Matatu Sacco', borrowerType: 'Cooperative', sector: 'Transportation', city: '', country: 'Kenya', borrowerRegNo: '', loanAmount: 52000, loanTenure: 60, loanStartDate: '2022-06-01', loanEndDate: '2027-06-01', loanStatus: 'Active', extraData: { vehicleType: 'Minibus', vehicleNumber: 'KCH 672G', vehicleMakeModel: 'Toyota Coaster', fuelType: 'Diesel', vehicleValue: 60000 } },

      // Mortgage
      { loanId: 'MG-KE-001', assetClass: 'Mortgage', borrowerName: 'John Mwangi', borrowerType: 'Individual', sector: 'Residential', city: '', country: 'Kenya', borrowerRegNo: 'ID-KE-78833', loanAmount: 142000, loanTenure: 240, loanStartDate: '2023-02-01', loanEndDate: '2043-02-01', loanStatus: 'Active', extraData: { buildingName: 'Sunrise Apartments', yearBuilt: 2019, propertyType: 'Apartment', propertyLocation: 'Westlands', propertyValue: 185000, floorArea: 95 } },
      { loanId: 'MG-KE-002', assetClass: 'Mortgage', borrowerName: 'Sarah Chebet', borrowerType: 'Individual', sector: 'Residential', city: '', country: 'Kenya', borrowerRegNo: 'ID-KE-12445', loanAmount: 128000, loanTenure: 180, loanStartDate: '2024-05-15', loanEndDate: '2039-05-15', loanStatus: 'Active', extraData: { buildingName: 'Valley View Estate', yearBuilt: 2021, propertyType: 'Apartment', propertyLocation: 'Kitengela', propertyValue: 165000, floorArea: 85 } },
      { loanId: 'MG-KE-003', assetClass: 'Mortgage', borrowerName: 'Peter Omondi', borrowerType: 'Individual', sector: 'Residential', city: '', country: 'Kenya', borrowerRegNo: 'ID-KE-45332', loanAmount: 178000, loanTenure: 300, loanStartDate: '2022-03-10', loanEndDate: '2047-03-10', loanStatus: 'Active', extraData: { buildingName: 'Green Park Maisonettes', yearBuilt: 2018, propertyType: 'Maisonette', propertyLocation: 'Rongai', propertyValue: 245000, floorArea: 140 } },
      { loanId: 'MG-KE-010', assetClass: 'Mortgage', borrowerName: 'Esther Muthoni', borrowerType: 'Individual', sector: 'Residential', city: '', country: 'Kenya', borrowerRegNo: 'ID-KE-667788', loanAmount: 245000, loanTenure: 300, loanStartDate: '2025-01-20', loanEndDate: '2050-01-20', loanStatus: 'Active', extraData: { buildingName: 'Kilimani Luxury', yearBuilt: 2023, propertyType: 'Apartment', propertyLocation: 'Kilimani, Nairobi', propertyValue: 325000, floorArea: 135 } },
      { loanId: 'MG-KE-013', assetClass: 'Mortgage', borrowerName: 'Daniel Otieno', borrowerType: 'Individual', sector: 'Residential', city: '', country: 'Kenya', borrowerRegNo: 'ID-KE-223344', loanAmount: 148000, loanTenure: 240, loanStartDate: '2023-04-15', loanEndDate: '2043-04-15', loanStatus: 'Active', extraData: { buildingName: 'Parklands Heights', yearBuilt: 2019, propertyType: 'Apartment', propertyLocation: 'Parklands', propertyValue: 192000, floorArea: 88 } }
    ];

    for (const c of seededConfigs) {
      await client.query(
        `INSERT INTO loan_configurations(loan_id, asset_class, borrower_name, borrower_type, sector, city, country, borrower_reg_no, loan_amount, loan_tenure, loan_start_date, loan_end_date, loan_status, extra_data) 
         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          c.loanId,
          c.assetClass,
          c.borrowerName,
          c.borrowerType || '',
          c.sector || '',
          c.city || '',
          c.country || '',
          c.borrowerRegNo || '',
          c.loanAmount,
          c.loanTenure || 0,
          c.loanStartDate || '',
          c.loanEndDate || '',
          c.loanStatus || 'Active',
          JSON.stringify(c.extraData || {})
        ]
      );
    }
  }
}
