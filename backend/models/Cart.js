const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1'],
    default: 1
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals for backward compatibility with Customer frontend
CartItemSchema.virtual('product').get(function () {
  return this.productId;
});

CartItemSchema.virtual('image').get(function () {
  return this.imageUrl;
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: false
  },
  items: [CartItemSchema],
  subtotal: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'carts',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual getter for legacy 'user' property
CartSchema.virtual('user').get(function () {
  return this.userId;
});

// Pre-save hook to calculate subtotal automatically
CartSchema.pre('save', function (next) {
  if (this.items && Array.isArray(this.items)) {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  } else {
    this.subtotal = 0;
  }
  next();
});

module.exports = mongoose.model('Cart', CartSchema);
