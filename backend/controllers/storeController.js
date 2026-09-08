import Store from '../models/Store.js';
import Product from '../models/Product.js';
import { calculateDistance, estimateDeliveryTime } from '../utils/locationUtils.js';

// Default fallback coordinates (Ara, Bihar)
const DEFAULT_LAT = 25.556;
const DEFAULT_LNG = 84.660;

const DEFAULT_STORE_LOGO = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=200';
const DEFAULT_STORE_BANNER = 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=800';

const sanitizeStoreImage = (url, fallback) => {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (trimmed.startsWith('blob:') || !trimmed.startsWith('http')) return fallback;
  return trimmed;
};

// @desc    Get nearby stores sorted by distance
// @route   GET /api/stores
// @access  Public
const getStores = async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat) || DEFAULT_LAT;
    const userLng = parseFloat(req.query.lng) || DEFAULT_LNG;
    const search = req.query.search;
    const limit = parseInt(req.query.limit) || 20;

    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const stores = await Store.find(query).lean();

    // Get product counts for all stores
    const productCounts = await Product.aggregate([
      { $group: { _id: '$store', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    productCounts.forEach(item => {
      if (item._id) {
        countMap[item._id.toString()] = item.count;
      }
    });

    // Calculate distance and delivery metrics dynamically
    const enrichedStores = stores.map(store => {
      const distanceKm = calculateDistance(userLat, userLng, store.lat, store.lng);
      const { deliveryTime, isDeliverable } = estimateDeliveryTime(distanceKm);
      return {
        ...store,
        logo: sanitizeStoreImage(store.logo, DEFAULT_STORE_LOGO),
        banner: sanitizeStoreImage(store.banner, DEFAULT_STORE_BANNER),
        imageUrl: sanitizeStoreImage(store.imageUrl, DEFAULT_STORE_BANNER),
        isOpen: store.isOpen !== false,
        distanceKm,
        deliveryTime,
        isDeliverable,
        productCount: countMap[store._id.toString()] || 0
      };
    });

    // Sort by nearest store first
    enrichedStores.sort((a, b) => a.distanceKm - b.distanceKm);

    res.json(enrichedStores.slice(0, limit));
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get store details and products
// @route   GET /api/stores/:id
// @access  Public
const getStoreById = async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat) || DEFAULT_LAT;
    const userLng = parseFloat(req.query.lng) || DEFAULT_LNG;

    const store = await Store.findById(req.params.id).lean();
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const distanceKm = calculateDistance(userLat, userLng, store.lat, store.lng);
    const { deliveryTime, isDeliverable } = estimateDeliveryTime(distanceKm);

    const products = await Product.find({ store: store._id }).lean();
    const enrichedProducts = products.map(prod => ({
      ...prod,
      image: (prod.image && !prod.image.startsWith('blob:') && prod.image.startsWith('http')) ? prod.image : (prod.imageUrl && !prod.imageUrl.startsWith('blob:') && prod.imageUrl.startsWith('http')) ? prod.imageUrl : 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400',
      imageUrl: (prod.imageUrl && !prod.imageUrl.startsWith('blob:') && prod.imageUrl.startsWith('http')) ? prod.imageUrl : (prod.image && !prod.image.startsWith('blob:') && prod.image.startsWith('http')) ? prod.image : 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400',
      storeName: store.name,
      distanceKm,
      deliveryTime,
      isDeliverable
    }));

    res.json({
      store: {
        ...store,
        logo: sanitizeStoreImage(store.logo, DEFAULT_STORE_LOGO),
        banner: sanitizeStoreImage(store.banner, DEFAULT_STORE_BANNER),
        imageUrl: sanitizeStoreImage(store.imageUrl, DEFAULT_STORE_BANNER),
        isOpen: store.isOpen !== false,
        distanceKm,
        deliveryTime,
        isDeliverable,
        productCount: products.length
      },
      products: enrichedProducts
    });
  } catch (error) {
    console.error('Error fetching store details:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export {
  getStores,
  getStoreById
};
