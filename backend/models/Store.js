const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a store name'],
    trim: true
  },
  tagline: {
    type: String,
    default: 'Hyperlocal Fresh Express'
  },
  logo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=200'
  },
  banner: {
    type: String,
    default: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=800'
  },
  address: {
    type: String,
    required: [true, 'Please add store address']
  },
  city: {
    type: String,
    default: 'Ara'
  },
  area: {
    type: String,
    default: 'Grand Trunk Road'
  },
  pincode: {
    type: String,
    default: '802301'
  },
  lat: {
    type: Number,
    required: [true, 'Please add store latitude']
  },
  lng: {
    type: Number,
    required: [true, 'Please add store longitude']
  },
  rating: {
    type: Number,
    default: 4.8
  },
  numRatings: {
    type: Number,
    default: 142
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  phone: {
    type: String,
    default: '+91 9876543210'
  },
  categories: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Store', StoreSchema);
