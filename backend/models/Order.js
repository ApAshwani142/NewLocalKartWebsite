const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true
    },
    deliveryPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryPartner',
      required: false
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Accepted', 'PickedUp', 'InTransit', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0.0
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 40.0
    },
    tax: {
      type: Number,
      required: true,
      default: 0.0
    },
    customerName: {
      type: String,
      required: true
    },
    customerPhone: {
      type: String,
      required: true
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Please add a delivery address']
    },
    notes: {
      type: String
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
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    paidAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for backward compatibility with frontend expecting order.user
OrderSchema.virtual('user').get(function () {
  return this.customerId;
});

// Virtual for backward compatibility with frontend expecting order.store
OrderSchema.virtual('store').get(function () {
  return this.shopId;
});

// Virtual for backward compatibility with frontend expecting order.totalPrice
OrderSchema.virtual('totalPrice').get(function () {
  return this.totalAmount;
});

// Virtual for backward compatibility with frontend expecting order.deliveryStatus
OrderSchema.virtual('deliveryStatus').get(function () {
  return this.status;
});

module.exports = mongoose.model('Order', OrderSchema, 'orders');
