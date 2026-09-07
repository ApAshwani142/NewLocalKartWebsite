import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to get or create cart for authenticated user
const getOrCreateCart = async (userId) => {
  const userObjId = typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
  let cart = await Cart.findOne({ $or: [{ userId: userObjId }, { userId }] }).populate('items.productId');
  if (!cart) {
    try {
      cart = await Cart.create({ userId: userObjId, items: [], subtotal: 0 });
    } catch (err) {
      if (err.code === 11000 && (err.message.includes('user_1') || (err.errmsg && err.errmsg.includes('user_1')))) {
        await Cart.collection.dropIndex('user_1').catch(() => {});
        cart = await Cart.create({ userId: userObjId, items: [], subtotal: 0 });
      } else {
        throw err;
      }
    }
  }
  return cart;
};

// @desc    Get logged in user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId;
    const cart = await getOrCreateCart(userId);
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id || req.user.id || req.user.userId;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid or missing productId' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.findOne({ user: userId });
    }

    const shopId = product.shopId || product.shop || product.store;
    const itemPrice = Number(product.price || 0);
    const itemName = product.name || 'Product';
    const itemImage = product.imageUrl || product.image || '';

    if (!cart) {
      cart = new Cart({
        userId,
        shopId,
        items: [{
          productId: product._id,
          name: itemName,
          price: itemPrice,
          quantity: Number(quantity),
          imageUrl: itemImage
        }]
      });
    } else {
      cart.shopId = shopId || cart.shopId;
      const itemIndex = cart.items.findIndex(
        (item) => (item.productId && item.productId.toString() === productId) || (item.product && item.product.toString() === productId)
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
        cart.items[itemIndex].price = itemPrice; // update with latest product price
        cart.items[itemIndex].name = itemName;
        cart.items[itemIndex].imageUrl = itemImage;
      } else {
        cart.items.push({
          productId: product._id,
          name: itemName,
          price: itemPrice,
          quantity: Number(quantity),
          imageUrl: itemImage
        });
      }
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
const updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    const userId = req.user._id || req.user.id || req.user.userId;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId format' });
    }

    if (quantity === undefined || Number(quantity) < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.findOne({ user: userId });
    }
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => (item.productId && item.productId.toString() === productId) || (item.product && item.product.toString() === productId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = Number(quantity);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(updatedCart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id || req.user.id || req.user.userId;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId format' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.findOne({ user: userId });
    }
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => (item.productId && item.productId.toString() !== productId) && (item.product && item.product.toString() !== productId)
    );
    if (cart.items.length === 0) {
      cart.shopId = undefined;
    }
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(updatedCart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.findOne({ user: userId });
    }
    if (cart) {
      cart.items = [];
      cart.shopId = undefined;
      cart.subtotal = 0;
      await cart.save();
    }
    res.json({ message: 'Cart cleared successfully', items: [], subtotal: 0 });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
};
