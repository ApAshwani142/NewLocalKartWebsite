import mongoose from 'mongoose';
import Address from '../models/Address.js';

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
    const { name, phone, label, houseNo, street, area, landmark, city, pincode, lat, lng, isDefault } = req.body;

    if (!street && !houseNo) {
      return res.status(400).json({ message: 'Street or house address is required' });
    }

    const existingCount = await Address.countDocuments({ userId });
    const shouldBeDefault = Boolean(isDefault) || existingCount === 0;

    if (shouldBeDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const newAddress = await Address.create({
      userId,
      name: name || req.user.name || '',
      phone: phone || req.user.phone || '',
      label: label || 'Home',
      houseNo: houseNo || '',
      street: street || houseNo,
      landmark: landmark || '',
      area: area || '',
      city: city || 'Ara',
      pincode: pincode || '802301',
      lat: lat ? Number(lat) : 25.556,
      lng: lng ? Number(lng) : 84.660,
      isDefault: shouldBeDefault
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
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
    const { name, phone, label, houseNo, street, area, landmark, city, pincode, lat, lng, isDefault } = req.body;

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
      address.isDefault = true;
    }

    if (name !== undefined) address.name = name;
    if (phone !== undefined) address.phone = phone;
    if (label !== undefined) address.label = label;
    if (houseNo !== undefined) address.houseNo = houseNo;
    if (street !== undefined) address.street = street;
    if (landmark !== undefined) address.landmark = landmark;
    if (area !== undefined) address.area = area;
    if (city !== undefined) address.city = city;
    if (pincode !== undefined) address.pincode = pincode;
    if (lat !== undefined) address.lat = Number(lat);
    if (lng !== undefined) address.lng = Number(lng);

    await address.save();
    res.json(address);
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

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const wasDefault = address.isDefault;
    await Address.deleteOne({ _id: addressId });

    // If deleted address was default, make the newest remaining address default
    if (wasDefault) {
      const remaining = await Address.findOne({ userId }).sort({ createdAt: -1 });
      if (remaining) {
        remaining.isDefault = true;
        await remaining.save();
      }
    }

    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
