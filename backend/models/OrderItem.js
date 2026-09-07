import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    productImage: {
      type: String
    },
    quantity: {
      type: Number,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('OrderItem', OrderItemSchema, 'order_items');
