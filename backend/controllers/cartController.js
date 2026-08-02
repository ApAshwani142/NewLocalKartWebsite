const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get logged in user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

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

    if (!productId) {
      return res.status(400).json({ message: 'Please provide a productId' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity: Number(quantity) }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ product: productId, quantity: Number(quantity) });
      }
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
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

    if (quantity === undefined || Number(quantity) < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = Number(quantity);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
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

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
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
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared successfully', items: [] });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
};
