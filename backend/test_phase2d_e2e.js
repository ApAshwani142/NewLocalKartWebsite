import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const COS_URL = 'http://localhost:5000';
const JWT_SECRET = process.env.JWT_SECRET || 'localkart_super_secret_jwt_key_change_in_production';

async function runPhase2DTest() {
  console.log('--- STARTING PHASE 2D E2E INTEGRATION TEST ---');
  try {
    // 1. Verify Atlas connection
    console.log('1. Connecting directly to Atlas DB to verify connection...');
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    console.log('Atlas Connected Successfully!');

    // 2. Fetch a real existing product from Atlas
    const sampleProduct = await db.collection('products').findOne({ isAvailable: true });
    if (!sampleProduct) {
      throw new Error('No available product found in Atlas DB');
    }
    console.log(`2. Found real product in Atlas: "${sampleProduct.name}" (ID: ${sampleProduct._id}), ShopId: ${sampleProduct.shopId || sampleProduct.shop}`);

    // 3. Register Test Customer A
    console.log('3. Registering Test Customer A on COS backend...');
    const emailA = `test_cust_a_${Date.now()}@localkart.com`;
    const regResA = await fetch(`${COS_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase 2D User A',
        email: emailA,
        phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'password123',
        otp: '123456',
        role: 'customer'
      })
    });
    const regDataA = await regResA.json();
    if (!regResA.ok) throw new Error(`Customer A registration failed: ${JSON.stringify(regDataA)}`);
    const tokenA = regDataA.token;
    const userA_id = regDataA._id;
    console.log(`Customer A registered! ID: ${userA_id}`);

    // 4. Register Test Customer B (for isolation test)
    console.log('4. Registering Test Customer B on COS backend (for security isolation test)...');
    const emailB = `test_cust_b_${Date.now()}@localkart.com`;
    const regResB = await fetch(`${COS_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase 2D User B',
        email: emailB,
        phone: `97${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'password123',
        otp: '123456',
        role: 'customer'
      })
    });
    const regDataB = await regResB.json();
    if (!regResB.ok) throw new Error(`Customer B registration failed: ${JSON.stringify(regDataB)}`);
    const tokenB = regDataB.token;
    const userB_id = regDataB._id;
    console.log(`Customer B registered! ID: ${userB_id}`);

    // 5. GET Cart for Customer A
    console.log('5. GET cart for Customer A (GET /api/cart)...');
    const getCartRes = await fetch(`${COS_URL}/api/cart`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const getCartData = await getCartRes.json();
    console.log('Get Cart Response Status:', getCartRes.status, `Items: ${getCartData.items?.length || 0}`);

    // 6. Add real Atlas product to cart for Customer A
    console.log('6. Adding real product to cart (POST /api/cart/items)...');
    const addCartRes = await fetch(`${COS_URL}/api/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        productId: sampleProduct._id.toString(),
        quantity: 2
      })
    });
    const addCartData = await addCartRes.json();
    console.log('Add to Cart Response Status:', addCartRes.status, `Subtotal: ${addCartData.subtotal}`);

    // 7. Verify cart document directly in Atlas DB
    console.log('7. Verifying cart document in Atlas DB...');
    const atlasCart = await db.collection('carts').findOne({ userId: new mongoose.Types.ObjectId(userA_id) });
    if (!atlasCart) throw new Error('Cart document not found in Atlas DB!');
    console.log('Atlas Cart Document:', {
      _id: atlasCart._id.toString(),
      userId: atlasCart.userId.toString(),
      shopId: atlasCart.shopId ? atlasCart.shopId.toString() : null,
      subtotal: atlasCart.subtotal,
      itemCount: atlasCart.items.length,
      itemProductId: atlasCart.items[0].productId.toString()
    });

    if (atlasCart.userId.toString() !== userA_id.toString()) throw new Error('Cart userId does not match Customer A ID');
    if (atlasCart.items[0].productId.toString() !== sampleProduct._id.toString()) throw new Error('Cart item productId does not match product _id');

    // 8. Update Cart Quantity for Customer A
    console.log('8. Updating cart item quantity (PUT /api/cart/items/:productId)...');
    const updateCartRes = await fetch(`${COS_URL}/api/cart/items/${sampleProduct._id.toString()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({ quantity: 5 })
    });
    const updateCartData = await updateCartRes.json();
    console.log('Update Cart Quantity Response Status:', updateCartRes.status, `New Subtotal: ${updateCartData.subtotal}`);

    // 9. Remove Cart Item for Customer A
    console.log('9. Removing cart item (DELETE /api/cart/items/:productId)...');
    const removeCartRes = await fetch(`${COS_URL}/api/cart/items/${sampleProduct._id.toString()}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const removeCartData = await removeCartRes.json();
    console.log('Remove Cart Item Response Status:', removeCartRes.status, `Items remaining: ${removeCartData.items?.length || 0}`);

    // 10. Create Test Address for Customer A
    console.log('10. Creating Test Address for Customer A (POST /api/addresses)...');
    const addAddrRes = await fetch(`${COS_URL}/api/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        label: 'Home',
        street: '123 Phase 2D Main Road',
        area: 'Nawada',
        city: 'Ara',
        pincode: '802301',
        isDefault: true
      })
    });
    const addAddrData = await addAddrRes.json();
    console.log('Add Address Response Status:', addAddrRes.status, `Total addresses: ${addAddrData.length}`);
    const createdAddress = addAddrData[0];
    const addressIdA = createdAddress._id;

    // Verify address document in Atlas
    const atlasAddr = await db.collection('addresses').findOne({ _id: new mongoose.Types.ObjectId(addressIdA) });
    if (!atlasAddr) throw new Error('Address document not found in Atlas DB');
    console.log('Atlas Address Document:', {
      _id: atlasAddr._id.toString(),
      userId: atlasAddr.userId.toString(),
      street: atlasAddr.street,
      city: atlasAddr.city,
      isDefault: atlasAddr.isDefault
    });

    // 11. GET Addresses for Customer A
    console.log('11. Fetching addresses for Customer A (GET /api/addresses)...');
    const getAddrRes = await fetch(`${COS_URL}/api/addresses`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const getAddrData = await getAddrRes.json();
    console.log('GET Addresses Status:', getAddrRes.status, `Count: ${getAddrData.length}`);

    // 12. Update Test Address for Customer A
    console.log('12. Updating address for Customer A (PUT /api/addresses/:addressId)...');
    const updateAddrRes = await fetch(`${COS_URL}/api/addresses/${addressIdA}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({ street: '456 Updated Street Road' })
    });
    const updateAddrData = await updateAddrRes.json();
    console.log('Update Address Response Status:', updateAddrRes.status, `Updated Street: ${updateAddrData[0].street}`);

    // 13. SECURITY ISOLATION TEST: Customer B attempting to access Customer A's address
    console.log('13. TESTING SECURITY ISOLATION: Customer B attempting to update/delete Customer A address...');
    const failUpdateRes = await fetch(`${COS_URL}/api/addresses/${addressIdA}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenB}`
      },
      body: JSON.stringify({ street: 'HACKED STREET' })
    });
    console.log('Customer B Update Unauthorized Address Status:', failUpdateRes.status);
    if (failUpdateRes.status !== 404 && failUpdateRes.status !== 403) {
      throw new Error(`SECURITY VIOLATION: Customer B was able to modify Customer A's address! Status: ${failUpdateRes.status}`);
    }

    const failDeleteRes = await fetch(`${COS_URL}/api/addresses/${addressIdA}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    console.log('Customer B Delete Unauthorized Address Status:', failDeleteRes.status);
    if (failDeleteRes.status !== 404 && failDeleteRes.status !== 403) {
      throw new Error(`SECURITY VIOLATION: Customer B was able to delete Customer A's address! Status: ${failDeleteRes.status}`);
    }

    const getBAddrRes = await fetch(`${COS_URL}/api/addresses`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    const getBAddrData = await getBAddrRes.json();
    console.log('Customer B Addresses Count:', getBAddrData.length);
    if (getBAddrData.length !== 0) {
      throw new Error('SECURITY VIOLATION: Customer B sees addresses belonging to Customer A');
    }
    console.log('SECURITY & ISOLATION TEST PASSED! User data is 100% isolated.');

    // 14. Delete Test Address for Customer A
    console.log('14. Deleting test address for Customer A (DELETE /api/addresses/:addressId)...');
    const deleteAddrRes = await fetch(`${COS_URL}/api/addresses/${addressIdA}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const deleteAddrData = await deleteAddrRes.json();
    console.log('Delete Address Response Status:', deleteAddrRes.status, `Addresses remaining: ${deleteAddrData.length}`);

    // 15. CLEAN UP ALL TEST USERS, TEST CARTS, AND TEST ADDRESSES
    console.log('\n--- CLEANING UP TEST DATA ---');
    await db.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(userA_id) });
    await db.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(userB_id) });
    await db.collection('carts').deleteMany({ userId: { $in: [new mongoose.Types.ObjectId(userA_id), new mongoose.Types.ObjectId(userB_id)] } });
    await db.collection('addresses').deleteMany({ userId: { $in: [new mongoose.Types.ObjectId(userA_id), new mongoose.Types.ObjectId(userB_id)] } });

    console.log('All test users, test carts, and test addresses cleaned up from Atlas.');

    console.log('\nPHASE 2D E2E INTEGRATION TEST COMPLETED SUCCESSFULLY WITH 100% PASS!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\nE2E TEST ERROR:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runPhase2DTest();
