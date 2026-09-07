import Order from '../models/Order.js';
import Store from '../models/Store.js';
import User from '../models/User.js';
import {
  notifyShopkeeperNewOrder,
  notifyCustomerOrderAccepted,
  notifyRidersOrderReady,
  notifyCustomerOrderPickedUp,
  notifyCustomerOrderDelivered
} from './notificationService.js';

/**
 * Create Order & Trigger Shopkeeper FCM Notification
 */
async function createOrder(orderData, user) {
  const {
    orderItems,
    deliveryAddress,
    paymentMethod,
    subtotal,
    deliveryFee,
    tax,
    totalPrice,
    storeId
  } = orderData;

  const order = new Order({
    user: user._id,
    store: storeId || undefined,
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
    isPaid: paymentMethod === 'COD' ? false : false,
    deliveryStatus: 'Placed'
  });

  const createdOrder = await order.save();

  // Find shopkeeper for notification trigger
  try {
    const shopkeeper = await User.findOne({
      $or: [
        { store: storeId },
        { role: 'shopkeeper' }
      ]
    });

    if (shopkeeper) {
      await notifyShopkeeperNewOrder(createdOrder, shopkeeper._id);
    }
  } catch (err) {
    console.error('[OrderService] Error triggering shopkeeper FCM notification:', err.message);
  }

  return createdOrder;
}

/**
 * Update Order Delivery Status & Trigger Event Notifications
 * Statuses: 'Placed' -> 'Processing' -> 'Out for Delivery' -> 'Delivered' -> 'Cancelled'
 */
async function updateOrderStatusWithNotifications(orderId, newStatus) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  const oldStatus = order.deliveryStatus;
  order.deliveryStatus = newStatus;
  const updatedOrder = await order.save();

  // Trigger Notifications based on status transitions
  try {
    if (newStatus === 'Processing' && oldStatus === 'Placed') {
      // Shopkeeper Accepted Order
      await notifyCustomerOrderAccepted(updatedOrder);
    } else if (newStatus === 'Out for Delivery') {
      // Order Picked Up for Delivery
      await notifyCustomerOrderPickedUp(updatedOrder);
    } else if (newStatus === 'Delivered') {
      // Order Delivered
      await notifyCustomerOrderDelivered(updatedOrder);
    }
  } catch (err) {
    console.error('[OrderService] Error triggering status update notifications:', err.message);
  }

  return updatedOrder;
}

export {
  createOrder,
  updateOrderStatusWithNotifications
};
