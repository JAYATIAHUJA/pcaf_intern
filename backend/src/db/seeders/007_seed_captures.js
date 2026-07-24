export async function seed(client) {
  const capturesCheck = await client.query('SELECT COUNT(*) FROM data_captures');
  if (parseInt(capturesCheck.rows[0].count) === 0) {
    console.log('Seeding initial data captures...');
    const seededCaptures = [
      // --- FY 2025 Approved Captures ---
      {
        activityPeriod: 'Dec 2025',
        loanId: 'BL-KE-001',
        outstandingAmount: 1885000,
        dataQuality: '2a',
        financedEmissions: 188200,
        status: 'Approved',
        extraData: { totalEquity: '9230000', totalDebt: '21538000', scope1Emissions: '250000', scope2Emissions: '120000', scope3Emissions: '50000', companyRevenue: '12000000', companyEbit: '1800000', sectorEmissionIntensity: '240', sectorAverageIntensity: '320' }
      },
      {
        activityPeriod: 'Dec 2025',
        loanId: 'BL-KE-002',
        outstandingAmount: 1540000,
        dataQuality: '2b',
        financedEmissions: 45000,
        status: 'Approved',
        extraData: { totalEquity: '8000000', totalDebt: '15000000', scope1Emissions: '100000', scope2Emissions: '50000', scope3Emissions: '20000', companyRevenue: '10000000', companyEbit: '1200000', sectorEmissionIntensity: '220', sectorAverageIntensity: '300' }
      },
      {
        activityPeriod: 'Dec 2025',
        loanId: 'BL-KE-003',
        outstandingAmount: 960000,
        dataQuality: '3a',
        financedEmissions: 15000,
        status: 'Approved',
        extraData: { sectorAverageIntensity: '320' }
      },
      {
        activityPeriod: 'Dec 2025',
        loanId: 'CRE-KE-001',
        outstandingAmount: 4769000,
        dataQuality: '2a',
        financedEmissions: 39500,
        status: 'Approved',
        extraData: { actualEnergy: '82500', avgEmissionFactor: '0.78' }
      },
      {
        activityPeriod: 'Dec 2025',
        loanId: 'MV-KE-001',
        outstandingAmount: 14231,
        dataQuality: '1a',
        financedEmissions: 20450,
        status: 'Approved',
        extraData: { actualFuelConsumption: '18500', fuelEmissionFactor: '2.31', actualDistance: '120000', emissionFactor: '120', estimatedDistance: '145000', fuelEfficiency: '7.2', averageDistance: '135000', defaultEmissionFactor: '140', defaultIntensityFactor: '290' }
      },
      {
        activityPeriod: 'Dec 2025',
        loanId: 'MG-KE-001',
        outstandingAmount: 142000,
        dataQuality: '2a',
        financedEmissions: 12300,
        status: 'Approved',
        extraData: { actualEnergy: '95', avgEmissionFactor: '0.82' }
      },

      // --- FY 2024 Approved Captures (historic for YoY comparison) ---
      {
        activityPeriod: 'Dec 2024',
        loanId: 'BL-KE-001',
        outstandingAmount: 1800000,
        dataQuality: '2a',
        financedEmissions: 165000,
        status: 'Approved',
        extraData: {}
      },
      {
        activityPeriod: 'Dec 2024',
        loanId: 'BL-KE-002',
        outstandingAmount: 1400000,
        dataQuality: '2b',
        financedEmissions: 40000,
        status: 'Approved',
        extraData: {}
      },
      {
        activityPeriod: 'Dec 2024',
        loanId: 'CRE-KE-001',
        outstandingAmount: 4500000,
        dataQuality: '2a',
        financedEmissions: 35000,
        status: 'Approved',
        extraData: {}
      },
      {
        activityPeriod: 'Dec 2024',
        loanId: 'MV-KE-001',
        outstandingAmount: 13000,
        dataQuality: '1a',
        financedEmissions: 18000,
        status: 'Approved',
        extraData: {}
      },
      {
        activityPeriod: 'Dec 2024',
        loanId: 'MG-KE-001',
        outstandingAmount: 138000,
        dataQuality: '2a',
        financedEmissions: 11500,
        status: 'Approved',
        extraData: {}
      },

      // --- FY 2023 Approved Captures (historic for YoY comparison) ---
      {
        activityPeriod: 'Dec 2023',
        loanId: 'BL-KE-001',
        outstandingAmount: 1700000,
        dataQuality: '2a',
        financedEmissions: 145000,
        status: 'Approved',
        extraData: {}
      },
      {
        activityPeriod: 'Dec 2023',
        loanId: 'CRE-KE-001',
        outstandingAmount: 4200000,
        dataQuality: '2a',
        financedEmissions: 30000,
        status: 'Approved',
        extraData: {}
      },
      {
        activityPeriod: 'Dec 2023',
        loanId: 'MV-KE-001',
        outstandingAmount: 12000,
        dataQuality: '1a',
        financedEmissions: 15000,
        status: 'Approved',
        extraData: {}
      },
      {
        activityPeriod: 'Dec 2023',
        loanId: 'MG-KE-001',
        outstandingAmount: 130000,
        dataQuality: '2a',
        financedEmissions: 10000,
        status: 'Approved',
        extraData: {}
      },

      // --- FY 2026 Draft and Submitted Captures (active workflow) ---
      {
        activityPeriod: 'Jun 2026',
        loanId: 'BL-KE-005',
        outstandingAmount: 0,
        dataQuality: null,
        financedEmissions: 0,
        status: 'Pending for Capture',
        extraData: {}
      },
      {
        activityPeriod: 'Jun 2026',
        loanId: 'BL-KE-007',
        outstandingAmount: 0,
        dataQuality: null,
        financedEmissions: 0,
        status: 'Pending for Capture',
        extraData: {}
      },
      {
        activityPeriod: 'Jun 2026',
        loanId: 'BL-KE-001',
        outstandingAmount: 1540000,
        dataQuality: '2a',
        financedEmissions: 5940,
        status: 'Submitted & Pending',
        extraData: { totalEquity: '9230000', totalDebt: '21538000', scope1Emissions: '2500', scope2Emissions: '1200', scope3Emissions: '500', companyRevenue: '12000000', companyEbit: '1800000', sectorEmissionIntensity: '240', sectorAverageIntensity: '320' }
      },
      {
        activityPeriod: 'Jun 2026',
        loanId: 'BL-KE-003',
        outstandingAmount: 0,
        dataQuality: null,
        financedEmissions: 0,
        status: 'Pending for Capture',
        extraData: {}
      },
      {
        activityPeriod: 'Jun 2026',
        loanId: 'BL-KE-004',
        outstandingAmount: 0,
        dataQuality: null,
        financedEmissions: 0,
        status: 'Pending for Capture',
        extraData: {}
      },
      {
        activityPeriod: 'Jun 2026',
        loanId: 'BL-KE-006',
        outstandingAmount: 1280000,
        dataQuality: '1a',
        financedEmissions: 1280,
        status: 'Submitted & Pending',
        extraData: { totalEquity: '7700000', totalDebt: '1538000', scope1Emissions: '2500', scope2Emissions: '1200', scope3Emissions: '500', companyRevenue: '12000000', companyEbit: '1800000', sectorEmissionIntensity: '240', sectorAverageIntensity: '320' }
      },
      {
        activityPeriod: 'Apr 2025',
        loanId: 'MV-KE-002',
        outstandingAmount: 15200,
        dataQuality: '1a',
        financedEmissions: 5.80,
        status: 'Submitted & Pending',
        extraData: { actualFuelConsumption: '1850', fuelEmissionFactor: '2.31', actualDistance: '12000', emissionFactor: '120', estimatedDistance: '14500', fuelEfficiency: '7.2', averageDistance: '13500', defaultEmissionFactor: '140', defaultIntensityFactor: '290' }
      },
      {
        activityPeriod: 'Apr 2025',
        loanId: 'MV-KE-003',
        outstandingAmount: 62000,
        dataQuality: '1b',
        financedEmissions: 19.70,
        status: 'Submitted & Pending',
        extraData: { actualFuelConsumption: '1850', fuelEmissionFactor: '2.31', actualDistance: '12000', emissionFactor: '120', estimatedDistance: '14500', fuelEfficiency: '7.2', averageDistance: '13500', defaultEmissionFactor: '140', defaultIntensityFactor: '290' }
      },
      {
        activityPeriod: 'Jun 2026',
        loanId: 'CRE-KE-002',
        outstandingAmount: 2100000,
        dataQuality: '2a',
        financedEmissions: 3180,
        status: 'Submitted & Pending',
        extraData: { actualEnergy: '4120', avgEmissionFactor: '0.77' }
      },
      {
        activityPeriod: 'Jun 2026',
        loanId: 'MG-KE-002',
        outstandingAmount: 135000,
        dataQuality: '2a',
        financedEmissions: 1.92,
        status: 'Submitted & Pending',
        extraData: { actualEnergy: '7.2', avgEmissionFactor: '0.80' }
      }
    ];

    for (const cap of seededCaptures) {
      await client.query(
        `INSERT INTO data_captures(activity_period, loan_id, outstanding_amount, data_quality, financed_emissions, status, extra_data)
         VALUES($1, $2, $3, $4, $5, $6, $7)`,
        [cap.activityPeriod, cap.loanId, cap.outstandingAmount, cap.dataQuality, cap.financedEmissions, cap.status, JSON.stringify(cap.extraData)]
      );
    }
  }
}
