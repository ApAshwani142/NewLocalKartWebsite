import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  label: {
    type: String,
    default: 'Home'
  },
  name: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  houseNo: {
    type: String,
    default: ''
  },
  street: {
    type: String,
    required: [true, 'Street address is required']
  },
  landmark: {
    type: String,
    default: ''
  },
  area: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: 'Ara'
  },
  pincode: {
    type: String,
    default: '802301'
  },
  lat: {
    type: Number,
    default: 25.556
  },
  lng: {
    type: Number,
    default: 84.660
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'addresses'
});

export default mongoose.model('Address', AddressSchema);
