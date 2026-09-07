import mongoose from 'mongoose';

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

const ProductSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: false
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: false
    },
    storeName: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please add a product category']
    },
    description: {
      type: String,
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
      type: String
    },
    imageUrl: {
      type: String
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
    isAvailable: {
      type: Boolean,
      default: true
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual getter for backward compatibility with frontend expecting product.image
ProductSchema.virtual('resolvedImage').get(function () {
  return this.imageUrl || this.image || '';
});

// Map Product model strictly to 'products' collection
export default mongoose.model('Product', ProductSchema, 'products');

