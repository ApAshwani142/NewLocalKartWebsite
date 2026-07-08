const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all products (with optional search and category filters)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, isTrending, isDealOfTheDay } = req.query;
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

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Seed initial grocery products
// @route   POST /api/products/seed
// @access  Public
const seedProducts = async (req, res) => {
  try {
    // Delete existing products
    await Product.deleteMany();

    const sampleProducts = [
      // Vegetables
      {
        name: 'Organic Green Broccoli',
        category: 'Vegetables',
        description: 'Premium quality fresh green broccoli, rich in vitamins C and K, sourced directly from local organic farms in Bihar.',
        price: 80,
        originalPrice: 110,
        discount: 28,
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=400',
        rating: 4.8,
        unit: '500g',
        stock: 50,
        isTrending: false
      },
      {
        name: 'Fresh Red Tomatoes',
        category: 'Vegetables',
        description: 'Farm-fresh juicy red tomatoes, handpicked at peak ripeness. Packed with nutrition and ideal for daily salads, gravies, and soups.',
        price: 40,
        originalPrice: 60,
        discount: 33,
        image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=400',
        rating: 4.6,
        unit: '1 kg',
        stock: 60,
        isTrending: false
      },
      {
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
      // Fruits
      {
        name: 'Red Delicious Apples',
        category: 'Fruits',
        description: 'Crisp, sweet, and premium quality red delicious apples. Sourced from the cold valleys of Kashmir, washed, and packed safely.',
        price: 120,
        originalPrice: 160,
        discount: 25,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400',
        rating: 4.7,
        unit: '1 kg',
        stock: 40,
        isTrending: false
      },
      // Dairy & Eggs
      {
        name: 'Fresh Milk Bottle',
        category: 'Dairy & Eggs',
        description: 'Pure pasteurized farm fresh milk, rich in calcium and vitamin D. Delivered fresh daily from our partner dairies.',
        price: 60,
        originalPrice: 65,
        discount: 7,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=400',
        rating: 4.8,
        unit: '1 L',
        stock: 80,
        isTrending: false
      },
      {
        name: 'Farm Fresh Organic Eggs',
        category: 'Dairy & Eggs',
        description: 'Healthy and organic eggs from free-range chickens. Rich in protein and essential nutrients. Hand-sorted for quality assurance.',
        price: 90,
        originalPrice: 100,
        discount: 10,
        image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=400',
        rating: 4.9,
        unit: '12 Items',
        stock: 35,
        isTrending: false
      },
      // Meat & Fish
      {
        name: 'Fresh Tender Chicken Breast',
        category: 'Meat & Fish',
        description: 'Boneless, skinless raw chicken breast cuts. Hygienically processed, vacuum-packed, and shipped fresh under strict cold-chain control.',
        price: 240,
        originalPrice: 280,
        discount: 14,
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=400',
        rating: 4.7,
        unit: '1 kg',
        stock: 20,
        isTrending: false
      },
      // Fresh Bread
      {
        name: 'Whole Wheat Sandwich Bread',
        category: 'Fresh Bread',
        description: 'Freshly baked whole wheat bread loaf. Sliced and ready to eat, packed with dietary fiber and completely preservative-free.',
        price: 45,
        originalPrice: 50,
        discount: 10,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400',
        rating: 4.4,
        unit: '400g',
        stock: 30,
        isTrending: false
      },
      // Snacks
      {
        name: 'Salted Popcorn Pack',
        category: 'Snacks',
        description: 'Light, crispy, and perfectly salted popcorn. The ultimate healthy snack for movies, office breaks, or evening teas.',
        price: 50,
        originalPrice: 60,
        discount: 16,
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=400',
        rating: 4.5,
        unit: '150g',
        stock: 120,
        isTrending: false
      },
      // Beverages (Trending items matching screenshot 3)
      {
        name: 'Pure Orange Juice Bottle',
        category: 'Beverages',
        description: '100% natural, fresh-pressed orange juice. High in Vitamin C, completely pulp-fresh with zero artificial sweeteners or additives.',
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
        name: 'Pressed Apple Juice',
        category: 'Beverages',
        description: 'Cold-pressed apple juice made from handpicked crisp apples. Sweet, refreshing, and rich in natural antioxidants.',
        price: 105,
        originalPrice: 150,
        discount: 30,
        image: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?q=80&w=400',
        rating: 4.7,
        unit: '1 L',
        stock: 50,
        isTrending: true,
        isDealOfTheDay: true
      },
      {
        name: 'Organic Pomegranate Juice',
        category: 'Beverages',
        description: 'Freshly squeezed pomegranate juice, packed with antioxidants. A premium, tart, and fully organic drink for daily health.',
        price: 120,
        originalPrice: 170,
        discount: 29,
        image: 'https://images.unsplash.com/photo-1620992770674-133e09483855?q=80&w=400',
        rating: 4.9,
        unit: '1 L',
        stock: 40,
        isTrending: true,
        isDealOfTheDay: true
      },
      // Personal Care
      {
        name: 'Aloe Vera Hydrating Shampoo',
        category: 'Personal Care',
        description: 'Gentle, pH-balanced hydrating shampoo enriched with organic Aloe Vera. Repairs dry hair, nourishes scalp, and locks in moisture.',
        price: 199,
        originalPrice: 250,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=400',
        rating: 4.6,
        unit: '300ml',
        stock: 45,
        isTrending: false
      },
      // Home Care
      {
        name: 'Liquid Dishwash Gel',
        category: 'Home Care',
        description: 'Premium dishwashing liquid gel, formulated to cut through tough grease instantly. Soft on hands and leaves a fresh lemon fragrance.',
        price: 115,
        originalPrice: 130,
        discount: 11,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400',
        rating: 4.5,
        unit: '500ml',
        stock: 75,
        isTrending: false
      },
      // Cloth
      {
        name: 'Classic Cotton T-Shirt',
        category: 'Cloth',
        description: '100% premium combed cotton t-shirt. Soft, breathable, and pre-shrunk for the perfect fit.',
        price: 350,
        originalPrice: 499,
        discount: 30,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400',
        rating: 4.5,
        unit: '1 Item',
        stock: 25,
        isTrending: false
      },
      {
        name: 'Denim Jacket Classic',
        category: 'Cloth',
        description: 'Classic rugged denim jacket with button closures. Stylish and versatile for all seasons.',
        price: 850,
        originalPrice: 1200,
        discount: 29,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=400',
        rating: 4.7,
        unit: '1 Item',
        stock: 15,
        isTrending: false
      },
      // Electronic
      {
        name: 'Wireless Bluetooth Earbuds',
        category: 'Electronic',
        description: 'True wireless stereo earbuds with touch controls, premium sound, and up to 20 hours of battery life.',
        price: 699,
        originalPrice: 999,
        discount: 30,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400',
        rating: 4.6,
        unit: '1 Unit',
        stock: 40,
        isTrending: false
      },
      {
        name: 'Premium Smart Watch',
        category: 'Electronic',
        description: 'Sleek smart fitness watch with heart rate monitor, sleep tracking, and daily activity stats.',
        price: 1299,
        originalPrice: 1999,
        discount: 35,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400',
        rating: 4.8,
        unit: '1 Unit',
        stock: 20,
        isTrending: false
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    res.status(201).json({
      message: 'Products seeded successfully',
      count: createdProducts.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Seeding failed: ' + error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please provide rating and comment' });
    }

    const productId = req.params.id;

    // 1. Verify if the customer has purchased this product
    const hasOrdered = await Order.findOne({
      user: req.user._id,
      deliveryStatus: 'Delivered',
      'orderItems.product': productId
    });

    if (!hasOrdered) {
      return res.status(400).json({
        message: 'Only customers who have purchased and received this product can leave feedback.'
      });
    }

    // 2. Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 3. Check if user already reviewed
    const alreadyReviewed = product.reviews.some(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: 'You have already reviewed this product. Delete your existing review to submit a new one.'
      });
    }

    // 4. Create and push review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    // Calculate new average rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
const deleteProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Verify ownership
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this review' });
    }

    // Remove review
    product.reviews.pull(req.params.reviewId);
    product.numReviews = product.reviews.length;

    // Recalculate average rating
    if (product.reviews.length > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 4.5; // default fallback
    }

    await product.save();
    res.json({ message: 'Review deleted successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get product recommendations
// @route   GET /api/products/:id/recommendations
// @access  Public
const getProductRecommendations = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Recommend other products in same category (up to 4)
    let recommendations = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    }).limit(4);

    // If less than 4, fill with other popular items
    if (recommendations.length < 4) {
      const needed = 4 - recommendations.length;
      const extraItems = await Product.find({
        _id: { $ne: product._id, $nin: recommendations.map((r) => r._id) }
      }).limit(needed);
      recommendations = [...recommendations, ...extraItems];
    }

    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  seedProducts,
  createProductReview,
  deleteProductReview,
  getProductRecommendations
};
