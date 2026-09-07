import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  otp: {
    type: String,
    required: [true, 'Please add an OTP code']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Document will automatically delete after 5 minutes (300 seconds)
  }
});

export default mongoose.model('Otp', OtpSchema);
