import { API_ROUTES } from '../v1/constants.js';

const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

function buildApiUrl(routeGroup, route, params = {}) {
  const path = `${routeGroup.BASE}${route}`.replace(/\/+$/, '');
  const resolvedPath = Object.entries(params).reduce(
    (currentPath, [key, value]) => currentPath.replace(`:${key}`, value),
    path
  );

  return `${API_BASE_URL}${resolvedPath}`;
}

const ENDPOINTS = {
  authLogin: buildApiUrl(API_ROUTES.AUTH, API_ROUTES.AUTH.LOGIN),
  dashboard: buildApiUrl(API_ROUTES.DASHBOARD, API_ROUTES.DASHBOARD.GET),
  activateUser: (id) => buildApiUrl(API_ROUTES.USERS, API_ROUTES.USERS.ACTIVATE, { id }),
  deactivateUser: (id) => buildApiUrl(API_ROUTES.USERS, API_ROUTES.USERS.DEACTIVATE, { id })
};

async function runVerification() {
  console.log("=== PCAF Caching & Route Permissions Verification ===");

  // 1. Login as Alice (active Admin)
  console.log("1. Authenticating Alice...");
  const loginRes = await fetch(ENDPOINTS.authLogin, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "alice@example.com", password: "password" })
  });
  const authData = await loginRes.json();
  const token = authData.token;
  console.log("Authenticated Alice successfully.");

  // 2. Access dashboard (should succeed)
  console.log(`\n2. Accessing GET ${new URL(ENDPOINTS.dashboard).pathname} (Has 'view' permission)...`);
  const dashRes = await fetch(ENDPOINTS.dashboard, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  console.log(`   - Status code: ${dashRes.status} (Expected: 200)`);
  if (dashRes.status !== 200) throw new Error("Dashboard view failed!");

  // 3. Test active/inactive cache check
  // Find a test user id (Alice is user ID 1)
  console.log("\n3. Testing active/inactive check and cache invalidation...");
  console.log("   - Alice status is currently active (cached). Let's deactivate Alice...");
  
  // Deactivate Alice (needs User Management edit permission)
  const deactivateRes = await fetch(ENDPOINTS.deactivateUser(1), {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  console.log(`   - Deactivate status: ${deactivateRes.status} (Expected: 200)`);
  
  // Now try to access the dashboard with the same token
  console.log(`\n4. Accessing GET ${new URL(ENDPOINTS.dashboard).pathname} after deactivation (Should fail active check)...`);
  const dashResAfterDeactivate = await fetch(ENDPOINTS.dashboard, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  console.log(`   - Status code: ${dashResAfterDeactivate.status} (Expected: 403)`);
  const errBody = await dashResAfterDeactivate.json();
  console.log("   - Error response:", errBody);
  
  // 5. Activate Alice back
  console.log("\n5. Reactivating Alice...");
  // Re-login because we deactivated ourselves, let's login as another active admin Arjun (ID 4)
  console.log("   - Authenticating Arjun to reactivate Alice...");
  const arjunLoginRes = await fetch(ENDPOINTS.authLogin, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "a.kapoor@meridian.com", password: "password" })
  });
  const arjunAuth = await arjunLoginRes.json();
  
  const activateRes = await fetch(ENDPOINTS.activateUser(1), {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${arjunAuth.token}`,
      "Content-Type": "application/json"
    }
  });
  console.log(`   - Activate status: ${activateRes.status} (Expected: 200)`);

  console.log("\n=== Caching and Route Permissions Verification Complete ===");
}

runVerification().catch(console.error);

