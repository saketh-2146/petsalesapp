const API_URL = 'https://petconnect-wxdg.onrender.com';

async function testAll() {
  console.log('=== Backend Diagnostic Test ===\n');

  // Test 1: Health check
  try {
    console.log('1. Testing /api/health ...');
    const r = await fetch(`${API_URL}/api/health`);
    const body = await r.text();
    console.log(`   Status: ${r.status} | Body: ${body}\n`);
  } catch (e) {
    console.log(`   FAILED: ${e.message}\n`);
  }

  // Test 2: GET /api/pets (no auth)
  try {
    console.log('2. Testing GET /api/pets (no auth) ...');
    const r = await fetch(`${API_URL}/api/pets`);
    const body = await r.text();
    console.log(`   Status: ${r.status} | Body: ${body.substring(0, 300)}\n`);
  } catch (e) {
    console.log(`   FAILED: ${e.message}\n`);
  }

  // Test 3: POST /api/auth/login (no credentials)
  try {
    console.log('3. Testing POST /api/auth/login (empty body, should get 400) ...');
    const r = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const body = await r.text();
    console.log(`   Status: ${r.status} | Body: ${body}\n`);
  } catch (e) {
    console.log(`   FAILED: ${e.message}\n`);
  }

  // Test 4: Non-existent route (should get 404)
  try {
    console.log('4. Testing GET /api/nonexistent (should get 404) ...');
    const r = await fetch(`${API_URL}/api/nonexistent`);
    const body = await r.text();
    console.log(`   Status: ${r.status} | Body: ${body}\n`);
  } catch (e) {
    console.log(`   FAILED: ${e.message}\n`);
  }

  console.log('=== Done ===');
}

testAll();
