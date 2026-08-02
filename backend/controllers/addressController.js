const User = require('../models/User');

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.addresses || []);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Add new delivery address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const { label, street, area, city, pincode, isDefault } = req.body;

    if (!street) {
      return res.status(400).json({ message: 'Street address is required' });
    }

    const user = await User.findById(req.user._id);

    if (isDefault) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }

    const newAddress = {
      label: label || 'Home',
      street,
      area: area || '',
      city: city || 'Ara',
      pincode: pincode || '802301',
      isDefault: Boolean(isDefault) || user.addresses.length === 0
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete delivery address
// @route   DELETE /api/addresses/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.addressId
    );
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  deleteAddress
};
