const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Initialize Razorpay
let razorpay;
try {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keyId !== 'rzp_test_placeholder' && keySecret && keySecret !== 'rzp_secret_placeholder') {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
    console.log('Razorpay SDK Initialized with User Credentials.');
  } else {
    console.log('Razorpay credentials not provided or are placeholders. Running in Demo Mode.');
  }
} catch (error) {
  console.error('Error initializing Razorpay SDK:', error.message);
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Create order in Database (unpaid initially)
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item.product,
        qty: item.qty
      })),
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      totalPrice,
      isPaid: paymentMethod === 'COD' ? false : false // Razorpay order needs payment verification first
    });

    const createdOrder = await order.save();

    // If payment method is Razorpay, create Razorpay Order
    if (paymentMethod === 'Razorpay') {
      const amountInPaise = Math.round(totalPrice * 100); // Razorpay amounts are in paise (e.g. ₹100 = 10000 paise)

      if (razorpay) {
        // Real Razorpay Order Creation
        const options = {
          amount: amountInPaise,
          currency: 'INR',
          receipt: `receipt_order_${createdOrder._id}`
        };

        const razorpayOrder = await razorpay.orders.create(options);
        
        return res.status(201).json({
          order: createdOrder,
          razorpayOrder: {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
          }
        });
      } else {
        // Fallback Demo Mode (Mock Razorpay Order)
        console.log('Generating Mock Razorpay Order...');
        return res.status(201).json({
          order: createdOrder,
          razorpayOrder: {
            id: `order_mock_${Math.random().toString(36).substr(2, 9)}`,
            amount: amountInPaise,
            currency: 'INR',
            keyId: 'rzp_test_placeholder',
            isDemo: true
          }
        });
      }
    }

    // COD order returns directly
    res.status(201).json({ order: createdOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if it's a demo order
    if (razorpay_order_id.startsWith('order_mock_')) {
      console.log('Verifying Mock Razorpay Payment...');
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'captured',
        update_time: new Date().toISOString(),
        email_address: req.user.email
      };

      const updatedOrder = await order.save();
      return res.json({ success: true, order: updatedOrder });
    }

    // Real Signature Verification
    if (!razorpay) {
      return res.status(400).json({ message: 'Razorpay SDK not configured' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const shasum = crypto.createHmac('sha256', keySecret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      console.log('Payment Signature Verified successfully.');
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'captured',
        update_time: new Date().toISOString(),
        email_address: req.user.email
      };

      const updatedOrder = await order.save();
      res.json({ success: true, order: updatedOrder });
    } else {
      console.error('Invalid signature match.');
      res.status(400).json({ message: 'Payment verification failed: signature mismatch' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Validate authorization
      if (order.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  addOrderItems,
  verifyPayment,
  getOrderById,
  getMyOrders
};
