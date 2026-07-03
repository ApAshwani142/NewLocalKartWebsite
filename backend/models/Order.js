const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      }
    }
  ],
  deliveryAddress: {
    type: String,
    required: [true, 'Please add a delivery address']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['COD', 'Razorpay'],
    default: 'COD'
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0.0
  },
  deliveryFee: {
    type: Number,
    required: true,
    default: 0.0
  },
  tax: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  deliveryStatus: {
    type: String,
    required: true,
    enum: ['Placed', 'Processing', 'Out for Delivery', 'Delivered'],
    default: 'Placed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
