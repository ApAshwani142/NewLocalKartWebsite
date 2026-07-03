const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a product category'],
    enum: [
      'Vegetables',
      'Fruits',
      'Dairy & Eggs',
      'Meat & Fish',
      'Fresh Bread',
      'Snacks',
      'Beverages',
      'Personal Care',
      'Home Care',
      'Organics'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please add a product description'],
    default: 'Fresh and premium quality product locally sourced and delivered in under 40 minutes.'
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price']
  },
  originalPrice: {
    type: Number
  },
  discount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: [true, 'Please add a product image URL']
  },
  rating: {
    type: Number,
    default: 4.5
  },
  reviews: [ReviewSchema],
  numReviews: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: '1 item'
  },
  stock: {
    type: Number,
    default: 100
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isDealOfTheDay: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
