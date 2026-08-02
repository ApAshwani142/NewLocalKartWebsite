const Product = require('../models/Product');
const Store = require('../models/Store');
const Order = require('../models/Order');
const { calculateDistance, estimateDeliveryTime } = require('../utils/locationUtils');

const DEFAULT_LAT = 25.556;
const DEFAULT_LNG = 84.660;

// @desc    Get all products (enriched with dynamic store distance & delivery time)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat) || DEFAULT_LAT;
    const userLng = parseFloat(req.query.lng) || DEFAULT_LNG;
    const { category, search, isTrending, isDealOfTheDay, storeId } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (isTrending) {
      query.isTrending = isTrending === 'true';
    }

    if (isDealOfTheDay) {
      query.isDealOfTheDay = isDealOfTheDay === 'true';
    }

    if (storeId) {
      query.store = storeId;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Populate store reference
    const products = await Product.find(query).populate('store').lean();

    // Enrich products with dynamic Haversine distance and delivery time
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

    // Sort by: Nearest Store -> Rating -> Popularity -> Price
    enrichedProducts.sort((a, b) => {
      if (a.distanceKm !== b.distanceKm) {
        return a.distanceKm - b.distanceKm;
      }
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return a.price - b.price;
    });

    res.json(enrichedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get single product by ID (with dynamic distance & delivery time)
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat) || DEFAULT_LAT;
    const userLng = parseFloat(req.query.lng) || DEFAULT_LNG;

    const product = await Product.findById(req.params.id).populate('store').lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const storeObj = product.store || {};
    const storeLat = storeObj.lat !== undefined ? storeObj.lat : DEFAULT_LAT;
    const storeLng = storeObj.lng !== undefined ? storeObj.lng : DEFAULT_LNG;

    const distanceKm = calculateDistance(userLat, userLng, storeLat, storeLng);
    const { deliveryTime, isDeliverable } = estimateDeliveryTime(distanceKm);

    const enrichedProduct = {
      ...product,
      storeId: storeObj._id,
      storeName: storeObj.name || product.storeName || 'Local Partner Store',
      storeLogo: storeObj.logo,
      storeIsOpen: storeObj.isOpen ?? true,
      distanceKm,
      deliveryTime,
      isDeliverable: isDeliverable && (storeObj.isOpen ?? true)
    };

    res.json(enrichedProduct);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Unified Hyperlocal Search (Products, Stores & Categories)
// @route   GET /api/products/search/all
// @access  Public
const searchHyperlocal = async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat) || DEFAULT_LAT;
    const userLng = parseFloat(req.query.lng) || DEFAULT_LNG;
    const q = req.query.q || '';

    if (!q.trim()) {
      return res.json({ products: [], stores: [], categories: [] });
    }

    const regex = new RegExp(q, 'i');

    // Search Stores
    const matchedStores = await Store.find({
      $or: [{ name: regex }, { area: regex }, { city: regex }]
    }).lean();

    const enrichedStores = matchedStores.map(st => {
      const distanceKm = calculateDistance(userLat, userLng, st.lat, st.lng);
      const { deliveryTime, isDeliverable } = estimateDeliveryTime(distanceKm);
      return {
        ...st,
        distanceKm,
        deliveryTime,
        isDeliverable
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    // Search Products
    const matchedProducts = await Product.find({
      $or: [{ name: regex }, { category: regex }, { description: regex }]
    }).populate('store').lean();

    const enrichedProducts = matchedProducts.map(prod => {
      const storeObj = prod.store || {};
      const storeLat = storeObj.lat !== undefined ? storeObj.lat : DEFAULT_LAT;
      const storeLng = storeObj.lng !== undefined ? storeObj.lng : DEFAULT_LNG;
      const distanceKm = calculateDistance(userLat, userLng, storeLat, storeLng);
      const { deliveryTime, isDeliverable } = estimateDeliveryTime(distanceKm);

      return {
        ...prod,
        storeId: storeObj._id,
        storeName: storeObj.name || prod.storeName || 'Local Partner Store',
        distanceKm,
        deliveryTime,
        isDeliverable: isDeliverable && (storeObj.isOpen ?? true)
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    // Categories matched
    const allCategories = [
      'Vegetables', 'Fruits', 'Dairy & Eggs', 'Meat & Fish',
      'Fresh Bread', 'Snacks', 'Beverages', 'Personal Care',
      'Home Care', 'Organics', 'Cloth', 'Electronic'
    ];
    const matchedCategories = allCategories.filter(c => c.toLowerCase().includes(q.toLowerCase()));

    res.json({
      products: enrichedProducts,
      stores: enrichedStores,
      categories: matchedCategories
    });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Seed initial stores and products
// @route   POST /api/products/seed
// @access  Public
const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany();
    await Store.deleteMany();

    // 1. Create sample stores with coordinates around Ara & Patna
    const createdStores = await Store.insertMany([
      {
        name: 'Gupta Kirana & General Store',
        tagline: 'Fresh Groceries & Daily Needs',
        logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200',
        banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800',
        address: 'Shop #12, Station Road',
        city: 'Ara',
        area: 'Station Road',
        pincode: '802301',
        lat: 25.5580,
        lng: 84.6620,
        rating: 4.9,
        numRatings: 184,
        isOpen: true,
        categories: ['Vegetables', 'Fruits', 'Dairy & Eggs', 'Snacks']
      },
      {
        name: 'SuperBazar Hyperlocal',
        tagline: 'Everything under one roof in 15 mins',
        logo: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=200',
        banner: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=800',
        address: 'Plot 45, Grand Trunk Road',
        city: 'Ara',
        area: 'Grand Trunk Road',
        pincode: '802301',
        lat: 25.5520,
        lng: 84.6560,
        rating: 4.8,
        numRatings: 230,
        isOpen: true,
        categories: ['Vegetables', 'Beverages', 'Snacks', 'Home Care']
      },
      {
        name: 'Verma Fresh Dairy & Bakery',
        tagline: 'Pure Milk, Eggs & Fresh Artisan Bread',
        logo: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=200',
        banner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800',
        address: 'Nawada Market, Near Gate #2',
        city: 'Ara',
        area: 'Nawada Market',
        pincode: '802302',
        lat: 25.5680,
        lng: 84.6750,
        rating: 4.7,
        numRatings: 95,
        isOpen: true,
        categories: ['Dairy & Eggs', 'Fresh Bread']
      },
      {
        name: 'City Fresh Meat & Fish Market',
        tagline: 'Hygienic Tender Meat & Cold Chain Delivery',
        logo: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=200',
        banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800',
        address: 'Dharhara Kothi Chowk',
        city: 'Ara',
        area: 'Dharhara Kothi',
        pincode: '802301',
        lat: 25.5490,
        lng: 84.6480,
        rating: 4.6,
        numRatings: 78,
        isOpen: true,
        categories: ['Meat & Fish']
      },
      {
        name: 'Apex Electronics & Accessories',
        tagline: 'Mobiles, Chargers & Smart Gadgets Express',
        logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=200',
        banner: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=800',
        address: 'Collectorate Road, Civil Lines',
        city: 'Ara',
        area: 'Civil Lines',
        pincode: '802301',
        lat: 25.5610,
        lng: 84.6680,
        rating: 4.8,
        numRatings: 112,
        isOpen: true,
        categories: ['Electronic']
      },
      {
        name: 'Patliputra Organics & Gourmet',
        tagline: 'Premium Farm Fresh Organic Produce',
        logo: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=200',
        banner: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=800',
        address: 'Boring Road, Patna',
        city: 'Patna',
        area: 'Boring Road',
        pincode: '800001',
        lat: 25.6120,
        lng: 85.1250,
        rating: 4.9,
        numRatings: 310,
        isOpen: true,
        categories: ['Organics', 'Fruits', 'Beverages']
      }
    ]);

    const storeGupta = createdStores[0]._id;
    const storeSuper = createdStores[1]._id;
    const storeVerma = createdStores[2]._id;
    const storeMeat = createdStores[3]._id;
    const storeApex = createdStores[4]._id;
    const storePatliputra = createdStores[5]._id;

    // 2. Sample products linked to stores
    const sampleProducts = [
      {
        store: storeGupta,
        storeName: 'Gupta Kirana & General Store',
        name: 'Organic Green Broccoli',
        category: 'Vegetables',
        description: 'Premium quality fresh green broccoli, rich in vitamins C and K, sourced directly from local organic farms.',
        price: 80,
        originalPrice: 110,
        discount: 28,
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=400',
        rating: 4.8,
        unit: '500g',
        stock: 50,
        isTrending: true
      },
      {
        store: storeGupta,
        storeName: 'Gupta Kirana & General Store',
        name: 'Fresh Red Tomatoes',
        category: 'Vegetables',
        description: 'Farm-fresh juicy red tomatoes, handpicked at peak ripeness. Ideal for daily salads, gravies, and soups.',
        price: 40,
        originalPrice: 60,
        discount: 33,
        image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=400',
        rating: 4.6,
        unit: '1 kg',
        stock: 60,
        isTrending: true
      },
      {
        store: storeSuper,
        storeName: 'SuperBazar Hyperlocal',
        name: 'Fresh Potatoes',
        category: 'Vegetables',
        description: 'Freshly harvested, locally-grown potatoes. High quality, thin-skinned, and perfect for boiling, baking, or frying.',
        price: 32,
        originalPrice: 40,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400',
        rating: 4.5,
        unit: '1 kg',
        stock: 100,
        isTrending: false
      },
      {
        store: storePatliputra,
        storeName: 'Patliputra Organics & Gourmet',
        name: 'Red Delicious Apples',
        category: 'Fruits',
        description: 'Crisp, sweet, and premium quality red delicious apples. Sourced from cold valleys, washed, and packed safely.',
        price: 120,
        originalPrice: 160,
        discount: 25,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400',
        rating: 4.7,
        unit: '1 kg',
        stock: 40,
        isTrending: true
      },
      {
        store: storeVerma,
        storeName: 'Verma Fresh Dairy & Bakery',
        name: 'Fresh Pure Milk Bottle',
        category: 'Dairy & Eggs',
        description: 'Pure pasteurized farm fresh milk, rich in calcium and vitamin D. Delivered fresh daily.',
        price: 60,
        originalPrice: 65,
        discount: 7,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=400',
        rating: 4.8,
        unit: '1 L',
        stock: 80,
        isTrending: true,
        isDealOfTheDay: true
      },
      {
        store: storeVerma,
        storeName: 'Verma Fresh Dairy & Bakery',
        name: 'Farm Fresh Organic Eggs',
        category: 'Dairy & Eggs',
        description: 'Healthy and organic eggs from free-range chickens. Rich in protein and essential nutrients.',
        price: 90,
        originalPrice: 100,
        discount: 10,
        image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=400',
        rating: 4.9,
        unit: '12 Items',
        stock: 35,
        isTrending: false
      },
      {
        store: storeMeat,
        storeName: 'City Fresh Meat & Fish Market',
        name: 'Fresh Tender Chicken Breast',
        category: 'Meat & Fish',
        description: 'Boneless, skinless raw chicken breast cuts. Hygienically processed under strict cold-chain control.',
        price: 240,
        originalPrice: 280,
        discount: 14,
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=400',
        rating: 4.7,
        unit: '1 kg',
        stock: 20,
        isTrending: false
      },
      {
        store: storeVerma,
        storeName: 'Verma Fresh Dairy & Bakery',
        name: 'Whole Wheat Sandwich Bread',
        category: 'Fresh Bread',
        description: 'Freshly baked whole wheat bread loaf. Sliced and ready to eat, completely preservative-free.',
        price: 45,
        originalPrice: 50,
        discount: 10,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400',
        rating: 4.4,
        unit: '400g',
        stock: 30,
        isTrending: false
      },
      {
        store: storeSuper,
        storeName: 'SuperBazar Hyperlocal',
        name: 'Salted Crispy Popcorn Pack',
        category: 'Snacks',
        description: 'Light, crispy, and perfectly salted popcorn. The ultimate healthy snack for movie breaks.',
        price: 50,
        originalPrice: 60,
        discount: 16,
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=400',
        rating: 4.5,
        unit: '150g',
        stock: 120,
        isTrending: false
      },
      {
        store: storeGupta,
        storeName: 'Gupta Kirana & General Store',
        name: 'Pure Orange Juice Bottle',
        category: 'Beverages',
        description: '100% natural, fresh-pressed orange juice. High in Vitamin C with zero artificial sweeteners.',
        price: 90,
        originalPrice: 130,
        discount: 30,
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=400',
        rating: 4.8,
        unit: '1 L',
        stock: 60,
        isTrending: true,
        isDealOfTheDay: true
      },
      {
        store: storeApex,
        storeName: 'Apex Electronics & Accessories',
        name: 'Fast Charging USB-C Cable (65W)',
        category: 'Electronic',
        description: 'Heavy duty braided USB-C to USB-C 65W fast charging power delivery cable with LED indicator.',
        price: 299,
        originalPrice: 499,
        discount: 40,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=400',
        rating: 4.8,
        unit: '1 Piece',
        stock: 45,
        isTrending: true,
        isDealOfTheDay: true
      }
    ];

    const seededProducts = await Product.insertMany(sampleProducts);

    res.status(201).json({
      message: 'Hyperlocal Stores and Products seeded successfully',
      storesCount: createdStores.length,
      productsCount: seededProducts.length
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const deleteProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const reviewIndex = product.reviews.findIndex(
        (r) => r._id.toString() === req.params.reviewId
      );

      if (reviewIndex === -1) {
        return res.status(404).json({ message: 'Review not found' });
      }

      const review = product.reviews[reviewIndex];
      if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to delete this review' });
      }

      product.reviews.splice(reviewIndex, 1);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
        : 4.5;

      await product.save();
      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const getProductRecommendations = async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat) || DEFAULT_LAT;
    const userLng = parseFloat(req.query.lng) || DEFAULT_LNG;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let recommendations = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    }).populate('store').lean().limit(4);

    if (recommendations.length < 4) {
      const needed = 4 - recommendations.length;
      const extraItems = await Product.find({
        _id: { $ne: product._id, $nin: recommendations.map((r) => r._id) }
      }).populate('store').lean().limit(needed);
      recommendations = [...recommendations, ...extraItems];
    }

    const enriched = recommendations.map(prod => {
      const storeObj = prod.store || {};
      const storeLat = storeObj.lat !== undefined ? storeObj.lat : DEFAULT_LAT;
      const storeLng = storeObj.lng !== undefined ? storeObj.lng : DEFAULT_LNG;
      const distanceKm = calculateDistance(userLat, userLng, storeLat, storeLng);
      const { deliveryTime, isDeliverable } = estimateDeliveryTime(distanceKm);
      return {
        ...prod,
        storeId: storeObj._id,
        storeName: storeObj.name || prod.storeName || 'Local Partner Store',
        distanceKm,
        deliveryTime,
        isDeliverable: isDeliverable && (storeObj.isOpen ?? true)
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Create new product (Shopkeeper / Admin)
// @route   POST /api/products
// @access  Private/Shopkeeper/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      originalPrice,
      discount,
      image,
      unit,
      stock,
      storeId,
      storeName,
      isTrending,
      isDealOfTheDay
    } = req.body;

    if (!name || !category || !price || !image) {
      return res.status(400).json({ message: 'Please provide name, category, price, and image' });
    }

    let assignedStore = storeId || req.user.store;

    // If shopkeeper has no store assigned yet, check if a store exists or create a default store for shopkeeper
    if (!assignedStore) {
      let existingStore = await Store.findOne({ name: storeName || `${req.user.name}'s Kirana Store` });
      if (!existingStore) {
        existingStore = await Store.create({
          name: storeName || `${req.user.name}'s Kirana Store`,
          address: 'Grand Trunk Road',
          city: 'Ara',
          lat: DEFAULT_LAT,
          lng: DEFAULT_LNG,
          phone: req.user.phone
        });
      }
      assignedStore = existingStore._id;
    }

    const product = await Product.create({
      name,
      category,
      description: description || 'Fresh and premium quality product locally sourced and delivered quickly.',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      discount: discount ? Number(discount) : 0,
      image,
      unit: unit || '1 item',
      stock: stock !== undefined ? Number(stock) : 100,
      store: assignedStore,
      storeName: storeName || req.user.name + "'s Store",
      createdBy: req.user._id,
      isTrending: Boolean(isTrending),
      isDealOfTheDay: Boolean(isDealOfTheDay)
    });

    const populatedProduct = await Product.findById(product._id).populate('store');
    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update product (Shopkeeper / Admin)
// @route   PUT /api/products/:id
// @access  Private/Shopkeeper/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check authorization: must be createdBy user, store owner, or admin
    if (
      req.user.role !== 'admin' &&
      product.createdBy &&
      product.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const fieldsToUpdate = [
      'name', 'category', 'description', 'price', 'originalPrice',
      'discount', 'image', 'unit', 'stock', 'isTrending', 'isDealOfTheDay', 'storeName'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete product (Shopkeeper / Admin)
// @route   DELETE /api/products/:id
// @access  Private/Shopkeeper/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (
      req.user.role !== 'admin' &&
      product.createdBy &&
      product.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get products added by logged-in shopkeeper
// @route   GET /api/products/merchant/my-products
// @access  Private/Shopkeeper/Admin
const getMerchantProducts = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query = {
        $or: [
          { createdBy: req.user._id },
          { store: req.user.store }
        ]
      };
    }

    const products = await Product.find(query).populate('store').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching merchant products:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  searchHyperlocal,
  seedProducts,
  createProductReview,
  deleteProductReview,
  getProductRecommendations,
  createProduct,
  updateProduct,
  deleteProduct,
  getMerchantProducts
};
