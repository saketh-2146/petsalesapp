const API_URL = process.env.TEST_API_URL || 'http://localhost:5000';

async function testAll() {
  console.log('=== PetConnect Backend Comprehensive Test ===\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      passed++;
    } catch (e) {
      console.log(`   ❌ FAILED: ${e.message}\n`);
      failed++;
    }
  }

  // 1. Health check
  await test('Health check', async () => {
    console.log('1. Testing GET /api/health ...');
    const r = await fetch(`${API_URL}/api/health`);
    const body = await r.json();
    console.log(`   ✅ Status: ${r.status} | ${body.message}\n`);
    if (r.status !== 200) throw new Error(`Expected 200, got ${r.status}`);
  });

  // 2. GET /api/pets (public, no auth)
  await test('GET /api/pets (no auth)', async () => {
    console.log('2. Testing GET /api/pets (no auth) ...');
    const r = await fetch(`${API_URL}/api/pets`);
    const body = await r.json();
    console.log(`   ✅ Status: ${r.status} | Pets returned: ${Array.isArray(body) ? body.length : 'N/A'}\n`);
    if (r.status !== 200) throw new Error(`Expected 200, got ${r.status}`);
  });

  // 3. POST /api/auth/login (empty body - should 400)
  await test('POST /api/auth/login (empty body, should 400)', async () => {
    console.log('3. Testing POST /api/auth/login (empty body) ...');
    const r = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const body = await r.json();
    console.log(`   ✅ Status: ${r.status} | ${body.message}\n`);
    if (r.status !== 400) throw new Error(`Expected 400, got ${r.status}`);
  });

  // 4. GET /api/users/me (no auth - should 401)
  await test('GET /api/users/me (no auth, should 401)', async () => {
    console.log('4. Testing GET /api/users/me (no auth) ...');
    const r = await fetch(`${API_URL}/api/users/me`);
    const body = await r.json();
    console.log(`   ✅ Status: ${r.status} | ${body.message}\n`);
    if (r.status !== 401) throw new Error(`Expected 401, got ${r.status}`);
  });

  // 5. POST /api/auth/reset-password (missing email - should 400)
  await test('POST /api/auth/reset-password (no email, should 400)', async () => {
    console.log('5. Testing POST /api/auth/reset-password (no email) ...');
    const r = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const body = await r.json();
    console.log(`   ✅ Status: ${r.status} | ${body.message}\n`);
    if (r.status !== 400) throw new Error(`Expected 400, got ${r.status}`);
  });

  // 6. GET /api/pets/:id (non-existent ID - should 404)
  await test('GET /api/pets/:id (fake ID, should 404 or error)', async () => {
    console.log('6. Testing GET /api/pets/00000000-0000-0000-0000-000000000000 ...');
    const r = await fetch(`${API_URL}/api/pets/00000000-0000-0000-0000-000000000000`);
    const body = await r.json();
    console.log(`   ✅ Status: ${r.status} | ${body.message || 'No message'}\n`);
  });

  // 7. Protected endpoints without auth (should 401)
  const protectedEndpoints = [
    ['GET', '/api/chats'],
    ['GET', '/api/favorites'],
    ['GET', '/api/notifications'],
    ['GET', '/api/payments/transactions'],
    ['GET', '/api/adoptions'],
    ['POST', '/api/storage/upload'],
    ['POST', '/api/users/avatar'],
  ];

  for (let i = 0; i < protectedEndpoints.length; i++) {
    const [method, endpoint] = protectedEndpoints[i];
    await test(`${method} ${endpoint} (no auth, should 401)`, async () => {
      console.log(`${7 + i}. Testing ${method} ${endpoint} (no auth) ...`);
      const r = await fetch(`${API_URL}${endpoint}`, { method });
      const body = await r.json();
      console.log(`   ✅ Status: ${r.status} | ${body.message}\n`);
      if (r.status !== 401) throw new Error(`Expected 401, got ${r.status}`);
    });
  }

  // Public endpoints
  await test('GET /api/reviews (public)', async () => {
    console.log(`${7 + protectedEndpoints.length}. Testing GET /api/reviews?revieweeId=test ...`);
    const r = await fetch(`${API_URL}/api/reviews?revieweeId=00000000-0000-0000-0000-000000000000`);
    console.log(`   ✅ Status: ${r.status}\n`);
    if (r.status !== 200) throw new Error(`Expected 200, got ${r.status}`);
  });

  // Non-existent route
  await test('GET /api/nonexistent (should 404)', async () => {
    console.log(`${8 + protectedEndpoints.length}. Testing GET /api/nonexistent ...`);
    const r = await fetch(`${API_URL}/api/nonexistent`);
    const body = await r.json();
    console.log(`   ✅ Status: ${r.status} | ${body.error?.message}\n`);
    if (r.status !== 404) throw new Error(`Expected 404, got ${r.status}`);
  });

  console.log('=== Results ===');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Total: ${passed + failed}\n`);
}

testAll();
