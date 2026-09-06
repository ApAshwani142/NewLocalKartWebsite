const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Store = require('../models/Store');

// Initialize Razorpay SDK if environment variables exist
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

// @desc    Create new order (Customer Checkout)
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      deliveryAddress,
      paymentMethod,
      subtotal: clientSubtotal,
      deliveryFee: clientDeliveryFee,
      tax: clientTax,
      totalPrice: clientTotalPrice,
      customerName,
      customerPhone,
      notes
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // 1. Fetch products from Atlas database & validate stock
    const validatedItems = [];
    let calcSubtotal = 0;
    let shopId = null;

    for (const item of orderItems) {
      const pId = item.product || item.productId || item._id;
      if (!pId || !pId.toString().match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: `Invalid or non-existent product ID: ${pId}` });
      }

      const productDoc = await Product.findById(pId);
      if (!productDoc) {
        return res.status(404).json({ message: `Product not found: ${pId}` });
      }

      const qty = parseInt(item.qty || item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ message: `Invalid item quantity: ${item.qty || item.quantity}` });
      }

      if (productDoc.stock < qty) {
        return res.status(400).json({
          message: `Insufficient stock for "${productDoc.name}". Available: ${productDoc.stock}, requested: ${qty}`
        });
      }

      if (!shopId) {
        shopId = productDoc.shopId || productDoc.store;
      }

      calcSubtotal += productDoc.price * qty;
      validatedItems.push({
        productDoc,
        qty,
        unitPrice: productDoc.price
      });
    }

    if (!shopId) {
      // Fallback: assign to first active shop in Atlas
      const fallbackShop = await Store.findOne();
      if (fallbackShop) shopId = fallbackShop._id;
    }

    const calcDeliveryFee = clientDeliveryFee !== undefined ? Number(clientDeliveryFee) : 40.0;
    const calcTax = clientTax !== undefined ? Number(clientTax) : 0.0;
    const calcTotal = calcSubtotal + calcDeliveryFee + calcTax;

    const formattedAddress = typeof deliveryAddress === 'string'
      ? deliveryAddress
      : `${deliveryAddress.street || ''}, ${deliveryAddress.area || ''}, ${deliveryAddress.city || 'Ara'} ${deliveryAddress.pincode || '802301'}`.trim();

    // 2. Create Order document in 'orders' collection
    const order = new Order({
      customerId: req.user._id,
      shopId: shopId,
      status: 'Pending',
      totalAmount: calcTotal,
      subtotal: calcSubtotal,
      deliveryFee: calcDeliveryFee,
      tax: calcTax,
      customerName: customerName || req.user.name || 'Customer',
      customerPhone: customerPhone || req.user.phone || '9876543210',
      deliveryAddress: formattedAddress,
      notes: notes || '',
      paymentMethod: paymentMethod || 'COD',
      isPaid: false
    });

    const createdOrder = await order.save();

    // 3. Create OrderItem documents in 'order_items' collection
    const itemsToInsert = validatedItems.map((item) => ({
      orderId: createdOrder._id,
      productId: item.productDoc._id,
      productName: item.productDoc.name,
      productImage: item.productDoc.imageUrl || item.productDoc.image || '',
      quantity: item.qty,
      unitPrice: item.unitPrice
    }));

    const createdOrderItems = await OrderItem.insertMany(itemsToInsert);

    // 4. Decrease product stock atomically with condition check in Atlas
    for (const item of validatedItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.productDoc._id, stock: { $gte: item.qty } },
        { $inc: { stock: -item.qty } },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(400).json({
          message: `Insufficient stock for "${item.productDoc.name}".`
        });
      }

      // 5. Audit log in inventory_logs
      try {
        const mongoose = require('mongoose');
        await mongoose.connection.db.collection('inventory_logs').insertOne({
          productId: item.productDoc._id,
          changeAmount: -item.qty,
          reason: `Customer Order #${createdOrder._id}`,
          stockBefore: item.productDoc.stock,
          stockAfter: updatedProduct.stock,
          createdAt: new Date()
        });
      } catch (logErr) {
        console.warn('Inventory log insertion warning:', logErr.message);
      }
    }

    // Format response for backward compatibility with frontend expecting order.orderItems
    const responseOrder = {
      ...createdOrder.toObject(),
      _id: createdOrder._id,
      user: createdOrder.customerId,
      store: createdOrder.shopId,
      totalPrice: createdOrder.totalAmount,
      deliveryStatus: createdOrder.status,
      orderItems: createdOrderItems.map((i) => ({
        _id: i._id,
        product: i.productId,
        name: i.productName,
        image: i.productImage,
        price: i.unitPrice,
        qty: i.quantity
      }))
    };

    // Razorpay Integration handling
    if (paymentMethod === 'Razorpay') {
      const amountInPaise = Math.round(calcTotal * 100);

      if (razorpay) {
        const options = {
          amount: amountInPaise,
          currency: 'INR',
          receipt: `receipt_order_${createdOrder._id}`
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return res.status(201).json({
          order: responseOrder,
          razorpayOrder: {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
          }
        });
      } else {
        console.log('Generating Mock Razorpay Order...');
        return res.status(201).json({
          order: responseOrder,
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

    res.status(201).json({ order: responseOrder });
  } catch (error) {
    console.error('Error creating order:', error);
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

    if (razorpay_order_id && razorpay_order_id.startsWith('order_mock_')) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id || 'mock_pay_id',
        status: 'captured',
        update_time: new Date().toISOString(),
        email_address: req.user.email
      };

      const updatedOrder = await order.save();
      return res.json({ success: true, order: updatedOrder });
    }

    if (!razorpay) {
      return res.status(400).json({ message: 'Razorpay SDK not configured' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const shasum = crypto.createHmac('sha256', keySecret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
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
      res.status(400).json({ message: 'Payment verification failed: signature mismatch' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const currentUserId = (req.user._id || req.user.id || req.user.userId || '').toString();
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const order = await Order.findById(req.params.id).lean();

    if (order) {
      if (order.customerId && order.customerId.toString() !== currentUserId) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }

      const items = await OrderItem.find({ orderId: order._id }).lean();
      const responseOrder = {
        ...order,
        user: order.customerId,
        store: order.shopId,
        totalPrice: order.totalAmount,
        deliveryStatus: order.status,
        orderItems: items.map((i) => ({
          _id: i._id,
          product: i.productId,
          name: i.productName,
          image: i.productImage,
          price: i.unitPrice,
          qty: i.quantity
        }))
      };

      res.json(responseOrder);
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
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 }).lean();
    const orderIds = orders.map((o) => o._id);
    const allItems = await OrderItem.find({ orderId: { $in: orderIds } }).lean();

    const itemsByOrder = new Map();
    allItems.forEach((item) => {
      const oId = item.orderId.toString();
      if (!itemsByOrder.has(oId)) itemsByOrder.set(oId, []);
      itemsByOrder.get(oId).push({
        _id: item._id,
        product: item.productId,
        name: item.productName,
        image: item.productImage,
        price: item.unitPrice,
        qty: item.quantity
      });
    });

    const responseOrders = orders.map((o) => ({
      ...o,
      user: o.customerId,
      store: o.shopId,
      totalPrice: o.totalAmount,
      deliveryStatus: o.status,
      orderItems: itemsByOrder.get(o._id.toString()) || []
    }));

    res.json(responseOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update order delivery status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Accepted', 'PickedUp', 'InTransit', 'Delivered', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      const orderItems = await OrderItem.find({ orderId: order._id });
      for (const item of orderItems) {
        const prod = await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { new: true }
        );
        if (prod) {
          try {
            const mongoose = require('mongoose');
            await mongoose.connection.db.collection('inventory_logs').insertOne({
              productId: item.productId,
              changeAmount: item.quantity,
              reason: `Order Cancellation #${order._id}`,
              stockBefore: prod.stock - item.quantity,
              stockAfter: prod.stock,
              createdAt: new Date()
            });
          } catch (logErr) {
            console.warn('Inventory log insertion warning:', logErr.message);
          }
        }
      }
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  addOrderItems,
  verifyPayment,
  getOrderById,
  getMyOrders,
  updateOrderStatus
};
