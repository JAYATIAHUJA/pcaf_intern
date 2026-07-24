async function verify() {
  console.log("=== PCAF API Aggregation & Ingestion Verification ===");
  
  // 1. Log in
  console.log("1. Authenticating as alice@example.com...");
  const loginRes = await fetch("http://localhost:5000/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "alice@example.com", password: "password" })
  });
  
  if (!loginRes.ok) {
    throw new Error(`Login failed with status ${loginRes.status}: ${await loginRes.text()}`);
  }
  
  const authData = await loginRes.json();
  const token = authData.token;
  console.log("✓ Authenticated successfully. User Name:", authData.user.name);
  
  // 2. Fetch Dashboard stats (Initial state)
  console.log("\n2. Fetching dashboard stats (Before import)...");
  const dashResBefore = await fetch("http://localhost:5000/v1/dashboard", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  
  if (!dashResBefore.ok) {
    throw new Error(`Dashboard fetch failed: ${await dashResBefore.text()}`);
  }
  
  const dashDataBefore = await dashResBefore.json();
  console.log("✓ Initial Dashboard Stats:");
  console.log("   - Total Financed Emissions:", dashDataBefore.totalFinancedEmissions);
  console.log("   - Portfolio Coverage:", dashDataBefore.portfolioCoverage, "%");
  console.log("   - Average Data Quality:", dashDataBefore.avgDataQuality);
  console.log("   - Pending Approvals:", dashDataBefore.pendingApprovals);

  // 3. Import portfolio via CSV import API
  console.log("\n3. Importing new portfolio configurations...");
  const newLoans = [
    {
      loanId: "BL-KE-900",
      assetClass: "Business Loans",
      borrowerName: "Mombasa Tea Packers Test",
      borrowerType: "Large Corporate",
      sector: "Agriculture, Forestry & Fishing",
      city: "Mombasa",
      country: "Kenya",
      loanAmount: 2000000,
      loanTenure: 60,
      loanStartDate: "2024-01-01",
      loanEndDate: "2029-01-01",
      outstandingAmount: 1800000,
      activityPeriod: "Dec 2025",
      financedEmissions: 10000,
      dataQuality: "2a"
    },
    {
      loanId: "CRE-KE-900",
      assetClass: "Commercial Real Estate",
      borrowerName: "Safari Heights Office Test",
      borrowerType: "Large Corporate",
      sector: "Construction & Real Estate",
      city: "Nairobi",
      country: "Kenya",
      loanAmount: 5000000,
      loanTenure: 120,
      loanStartDate: "2023-03-01",
      loanEndDate: "2033-03-01",
      outstandingAmount: 4500000,
      activityPeriod: "Dec 2025",
      financedEmissions: 5000,
      dataQuality: "2b"
    }
  ];

  const importRes = await fetch("http://localhost:5000/v1/loan-configurations/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ loans: newLoans })
  });

  if (!importRes.ok) {
    throw new Error(`Import failed: ${await importRes.text()}`);
  }

  const importSummary = await importRes.json();
  console.log("✓ Import API response:", importSummary);

  // 4. Retrieve captures to approve the newly imported captures, so dashboard updates emissions
  console.log("\n4. Approving imported captures to update dashboard emissions...");
  const capturesRes = await fetch("http://localhost:5000/v1/data-capture", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const captures = await capturesRes.json();
  
  // Find captures for our imported loans
  const importedCapIds = captures
    .filter(c => c.loanId === "BL-KE-900" || c.loanId === "CRE-KE-900")
    .map(c => c.id);

  console.log("   - Found imported capture IDs to approve:", importedCapIds);
  
  if (importedCapIds.length > 0) {
    const approveRes = await fetch("http://localhost:5000/v1/data-capture/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ ids: importedCapIds })
    });
    console.log("   - Approve status:", approveRes.status, await approveRes.json());
  }

  // 5. Fetch Dashboard stats (After import & approval)
  console.log("\n5. Fetching dashboard stats (After import & approval)...");
  const dashResAfter = await fetch("http://localhost:5000/v1/dashboard", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const dashDataAfter = await dashResAfter.json();
  console.log("✓ Updated Dashboard Stats:");
  console.log("   - Total Financed Emissions:", dashDataAfter.totalFinancedEmissions);
  console.log("   - Portfolio Coverage:", dashDataAfter.portfolioCoverage, "%");
  console.log("   - Average Data Quality:", dashDataAfter.avgDataQuality);
  console.log("   - Pending Approvals:", dashDataAfter.pendingApprovals);
  
  console.log("\n=== Ingestion Verification Complete ===");
}

verify().catch(console.error);
