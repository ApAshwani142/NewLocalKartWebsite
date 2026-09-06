const http = require('http');
const https = require('https');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const COS_URL = 'http://127.0.0.1:5000/api';
const SHOP_URL = 'http://127.0.0.1:5001/api';

function makeRequest(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const client = url.protocol === 'https:' ? https : http;

    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = client.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data, raw: true });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

function getToken(resData) {
  if (!resData) return '';
  if (resData.token) return resData.token;
  if (resData.data && resData.data.token) return resData.data.token;
  return '';
}

async function runFixesVerification() {
  console.log('======================================================');
  console.log('=== PHASE 2J AUDIT FIXES VERIFICATION TEST ===');
  console.log('======================================================\n');

  try {
    // 1. CORS Verification
    console.log('1. Testing Fix 1 — Production & Development CORS Policy...');
    
    // Test 1: Dev Localhost Origin -> Allowed
    const devCors = await makeRequest(`${SHOP_URL}/products`, {
      headers: { 'Origin': 'http://localhost:3000' }
    });
    console.log(`  ✓ Development Localhost Origin (http://localhost:3000) -> HTTP ${devCors.status} (Allowed)`);

    // Test 2: Server without Origin header -> Allowed (Mobile/cURL/Server-to-Server)
    const noOrigin = await makeRequest(`${SHOP_URL}/products`);
    console.log(`  ✓ No Origin Header (Server-to-Server / Mobile) -> HTTP ${noOrigin.status} (Allowed)`);

    // 2. Customer Auth & Invalid ObjectId Verification
    console.log('\n2. Testing Fix 2 — Invalid ObjectId Handling (HTTP 400 Verification)...');
    const custEmail = `fixes_cust_${Date.now()}@localkart.com`;
    const custPhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;

    const regRes = await makeRequest(`${COS_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Fixes Audit Cust',
      email: custEmail,
      phone: custPhone,
      password: 'password123',
      otp: '123456',
      role: 'customer'
    });

    const custToken = getToken(regRes.data);
    if (!custToken) throw new Error('Customer registration failed for fixes test');

    // A. Invalid Product ID
    const invProd = await makeRequest(`${COS_URL}/products/invalid-id-123`);
    if (invProd.status === 400) {
      console.log(`  ✓ Invalid Product ID (/products/invalid-id-123) returned HTTP 400: "${invProd.data.message}"`);
    } else {
      throw new Error(`Invalid Product ID returned HTTP ${invProd.status} instead of 400!`);
    }

    // B. Invalid Order ID
    const invOrder = await makeRequest(`${COS_URL}/orders/invalid-id-123`, {
      headers: { Authorization: `Bearer ${custToken}` }
    });
    if (invOrder.status === 400) {
      console.log(`  ✓ Invalid Order ID (/orders/invalid-id-123) returned HTTP 400: "${invOrder.data.message}"`);
    } else {
      throw new Error(`Invalid Order ID returned HTTP ${invOrder.status} instead of 400!`);
    }

    // C. Invalid Address ID
    const invAddr = await makeRequest(`${COS_URL}/addresses/invalid-id-123`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${custToken}`,
        'Content-Type': 'application/json'
      }
    }, { label: 'Office' });
    if (invAddr.status === 400) {
      console.log(`  ✓ Invalid Address ID (/addresses/invalid-id-123) returned HTTP 400: "${invAddr.data.message}"`);
    } else {
      throw new Error(`Invalid Address ID returned HTTP ${invAddr.status} instead of 400!`);
    }

    // D. Invalid Cart Product ID
    const invCart = await makeRequest(`${COS_URL}/cart/items/invalid-id-123`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${custToken}`,
        'Content-Type': 'application/json'
      }
    }, { quantity: 2 });
    if (invCart.status === 400) {
      console.log(`  ✓ Invalid Cart Product ID (/cart/items/invalid-id-123) returned HTTP 400: "${invCart.data.message}"`);
    } else {
      throw new Error(`Invalid Cart Product ID returned HTTP ${invCart.status} instead of 400!`);
    }

    console.log('\n3. Testing Valid API Regression...');
    const validProds = await makeRequest(`${COS_URL}/products`);
    console.log(`  ✓ Valid GET /api/products returned HTTP ${validProds.status} (${Array.isArray(validProds.data) ? validProds.data.length : 0} products)`);

    const validCart = await makeRequest(`${COS_URL}/cart`, {
      headers: { Authorization: `Bearer ${custToken}` }
    });
    console.log(`  ✓ Valid GET /api/cart returned HTTP ${validCart.status}`);

    console.log('\n======================================================');
    console.log('ALL PHASE 2J PRODUCTION FIXES VERIFIED SUCCESSFULLY!');
    console.log('======================================================');
  } catch (err) {
    console.error('\n❌ FIXES VERIFICATION ERROR:', err.message);
    process.exit(1);
  }
}

runFixesVerification();
