const Product = require('../models/Product');
const Store = require('../models/Store');
const { calculateDistance, estimateDeliveryTime } = require('../utils/locationUtils');

const DEFAULT_LAT = 25.556;
const DEFAULT_LNG = 84.660;

async function getAllProducts({ lat, lng, category, search, isTrending, isDealOfTheDay, storeId }) {
  const userLat = parseFloat(lat) || DEFAULT_LAT;
  const userLng = parseFloat(lng) || DEFAULT_LNG;

  let query = {};
  if (category) query.category = category;
  if (isTrending) query.isTrending = isTrending === 'true';
  if (isDealOfTheDay) query.isDealOfTheDay = isDealOfTheDay === 'true';
  if (storeId) query.store = storeId;
  if (search) query.name = { $regex: search, $options: 'i' };

  const products = await Product.find(query).populate('store').lean();

  const enrichedProducts = products.map((prod) => {
    const storeObj = prod.store || {};
    const storeLat = storeObj.lat !== undefined ? storeObj.lat : DEFAULT_LAT;
    const storeLng = storeObj.lng !== undefined ? storeObj.lng : DEFAULT_LNG;

    const distanceKm = calculateDistance(userLat, userLng, storeLat, storeLng);
    const { deliveryTime, isDeliverable } = estimateDeliveryTime(distanceKm);

    return {
      ...prod,
      storeId: storeObj._id,
      storeName: storeObj.name || prod.storeName || 'Local Partner Store',
      storeLogo: storeObj.logo,
      storeIsOpen: storeObj.isOpen ?? true,
      distanceKm,
      deliveryTime,
      isDeliverable: isDeliverable && (storeObj.isOpen ?? true)
    };
  });

  return enrichedProducts.sort((a, b) => a.distanceKm - b.distanceKm);
}

async function createProductForShopkeeper(productData, user) {
  let assignedStore = productData.storeId || user.store;

  if (!assignedStore) {
    let existingStore = await Store.findOne({ name: productData.storeName || `${user.name}'s Store` });
    if (!existingStore) {
      existingStore = await Store.create({
        name: productData.storeName || `${user.name}'s Kirana Store`,
        address: 'Grand Trunk Road',
        city: 'Ara',
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
        phone: user.phone
      });
    }
    assignedStore = existingStore._id;
  }

  const product = await Product.create({
    ...productData,
    price: Number(productData.price),
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : Number(productData.price),
    discount: productData.discount ? Number(productData.discount) : 0,
    unit: productData.unit || '1 item',
    stock: productData.stock !== undefined ? Number(productData.stock) : 100,
    store: assignedStore,
    storeName: productData.storeName || user.name + "'s Store",
    createdBy: user._id
  });

  return Product.findById(product._id).populate('store');
}

module.exports = {
  getAllProducts,
  createProductForShopkeeper
};
