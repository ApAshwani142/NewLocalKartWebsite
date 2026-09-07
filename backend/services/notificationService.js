import { admin } from '../config/firebaseAdmin.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

/**
 * Send Push Notification via Firebase Cloud Messaging (FCM)
 * @param {string} fcmToken - Target FCM registration token
 * @param {Object} payload - { title, body, data }
 */
async function sendFcmNotification(fcmToken, { title, body, data = {} }) {
  if (!fcmToken) {
    console.log('[NotificationService] No FCM Token available for user. Skipping FCM dispatch.');
    return { success: false, reason: 'No FCM token' };
  }

  // If Firebase Admin SDK is initialized
  if (admin && admin.apps && admin.apps.length > 0) {
    try {
      const message = {
        token: fcmToken,
        notification: {
          title,
          body
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      };

      const response = await admin.messaging().send(message);
      console.log(`[NotificationService] FCM Message sent successfully! MessageID: ${response}`);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('[NotificationService] Error sending FCM message:', error.message);
      return { success: false, error: error.message };
    }
  }

  console.log(`[NotificationService Simulation] FCM Push -> Title: "${title}", Body: "${body}"`);
  return { success: true, simulated: true };
}

/**
 * Helper to save in-app notification to DB & trigger FCM
 */
async function createAndSendNotification({ userId, title, message, type = 'ORDER_UPDATE', relatedId = '' }) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    // Save in-app notification to MongoDB
    const notif = await Notification.create({
      user: userId,
      title,
      message,
      type,
      relatedId
    });

    // Send FCM push notification if user has an fcmToken
    if (user.fcmToken) {
      await sendFcmNotification(user.fcmToken, {
        title,
        body: message,
        data: { type, relatedId }
      });
    }

    return notif;
  } catch (err) {
    console.error('[NotificationService] Error creating notification:', err.message);
    return null;
  }
}

// ORDER LIFECYCLE EVENT NOTIFICATION HANDLERS

/**
 * Event 1: Customer Places Order -> Notify Shopkeeper
 */
async function notifyShopkeeperNewOrder(order, shopkeeperUserId) {
  return createAndSendNotification({
    userId: shopkeeperUserId,
    title: '🛍️ New Order Received!',
    message: `You have received a new order #${order._id.toString().substring(18)} worth ₹${order.totalPrice}. Please prepare items.`,
    type: 'ORDER_UPDATE',
    relatedId: order._id.toString()
  });
}

/**
 * Event 2: Shopkeeper Accepts Order -> Notify Customer
 */
async function notifyCustomerOrderAccepted(order) {
  return createAndSendNotification({
    userId: order.user,
    title: '✅ Order Accepted!',
    message: `Your order #${order._id.toString().substring(18)} has been accepted by the store and is currently being packed.`,
    type: 'ORDER_UPDATE',
    relatedId: order._id.toString()
  });
}

/**
 * Event 3: Order Ready for Pickup -> Notify Delivery Agent
 */
async function notifyRidersOrderReady(order, riderUserId) {
  return createAndSendNotification({
    userId: riderUserId,
    title: '🛵 Order Ready for Pickup',
    message: `Order #${order._id.toString().substring(18)} is ready for pickup at store. Tap to accept delivery request.`,
    type: 'ORDER_UPDATE',
    relatedId: order._id.toString()
  });
}

/**
 * Event 4: Order Picked Up -> Notify Customer
 */
async function notifyCustomerOrderPickedUp(order) {
  return createAndSendNotification({
    userId: order.user,
    title: '🚴 Out for Delivery!',
    message: `Your order #${order._id.toString().substring(18)} has been picked up and is on its way to your address.`,
    type: 'ORDER_UPDATE',
    relatedId: order._id.toString()
  });
}

/**
 * Event 5: Order Delivered -> Notify Customer
 */
async function notifyCustomerOrderDelivered(order) {
  return createAndSendNotification({
    userId: order.user,
    title: '🎉 Order Delivered!',
    message: `Your order #${order._id.toString().substring(18)} has been delivered. Thank you for shopping with e-LocalKart!`,
    type: 'ORDER_UPDATE',
    relatedId: order._id.toString()
  });
}

export {
  sendFcmNotification,
  createAndSendNotification,
  notifyShopkeeperNewOrder,
  notifyCustomerOrderAccepted,
  notifyRidersOrderReady,
  notifyCustomerOrderPickedUp,
  notifyCustomerOrderDelivered
};
