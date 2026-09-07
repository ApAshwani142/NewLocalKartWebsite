import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['customer', 'shopkeeper', 'delivery_partner', 'delivery_agent', 'admin', 'CUSTOMER', 'SHOPKEEPER', 'DELIVERY_PARTNER', 'ADMIN'],
    default: 'customer'
  },
  firebaseUid: {
    type: String,
    sparse: true
  },
  supabaseUid: {
    type: String,
    sparse: true
  },
  fcmToken: {
    type: String,
    default: ''
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: false
  },
  addresses: [
    {
      label: { type: String, default: 'Home' },
      street: { type: String, required: true },
      area: { type: String, default: '' },
      city: { type: String, default: 'Ara' },
      pincode: { type: String, default: '802301' },
      isDefault: { type: Boolean, default: false }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'users' });

// Hash password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);
