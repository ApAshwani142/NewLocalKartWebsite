const mongoose = require('mongoose');
const Address = require('../models/Address');

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId;
    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses || []);
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
    const userId = req.user._id || req.user.id || req.user.userId;
    const { label, street, area, city, pincode, lat, lng, isDefault } = req.body;

    if (!street) {
      return res.status(400).json({ message: 'Street address is required' });
    }

    const existingCount = await Address.countDocuments({ userId });
    const shouldBeDefault = Boolean(isDefault) || existingCount === 0;

    if (shouldBeDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    await Address.create({
      userId,
      label: label || 'Home',
      street,
      area: area || '',
      city: city || 'Ara',
      pincode: pincode || '802301',
      lat: lat !== undefined ? Number(lat) : 25.556,
      lng: lng !== undefined ? Number(lng) : 84.660,
      isDefault: shouldBeDefault
    });

    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    res.status(201).json(addresses);
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update delivery address
// @route   PUT /api/addresses/:addressId
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId;
    const { addressId } = req.params;
    const { label, street, area, city, pincode, lat, lng, isDefault } = req.body;

    if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: 'Invalid address ID format' });
    }

    // Strict user isolation check
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: 'Address not found or unauthorized' });
    }

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
      address.isDefault = true;
    }

    if (label !== undefined) address.label = label;
    if (street !== undefined) address.street = street;
    if (area !== undefined) address.area = area;
    if (city !== undefined) address.city = city;
    if (pincode !== undefined) address.pincode = pincode;
    if (lat !== undefined) address.lat = Number(lat);
    if (lng !== undefined) address.lng = Number(lng);

    await address.save();

    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete delivery address
// @route   DELETE /api/addresses/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId;
    const { addressId } = req.params;

    if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: 'Invalid address ID format' });
    }

    // Strict user isolation check
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: 'Address not found or unauthorized' });
    }

    await Address.deleteOne({ _id: addressId, userId });

    // If deleted address was default, make remaining first address default
    if (address.isDefault) {
      const remainingFirst = await Address.findOne({ userId }).sort({ createdAt: -1 });
      if (remainingFirst) {
        remainingFirst.isDefault = true;
        await remainingFirst.save();
      }
    }

    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
