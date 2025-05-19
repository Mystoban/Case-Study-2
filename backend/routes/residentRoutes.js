const express = require('express');
const router = express.Router();
const Resident = require('../models/Resident');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Public route handler for getting resident by ID
const getPublicResident = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid resident ID' });
    }
    const resident = await Resident.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    res.json(resident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Protected routes
// Get all residents
router.get('/', async (req, res) => {
  try {
    const residents = await Resident.find().sort({ createdAt: -1 });
    res.json(residents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search residents by fullname
router.get('/search', async (req, res) => {
  try {
    const { fullname } = req.query;
    const residents = await Resident.find({
      fullname: { $regex: fullname, $options: 'i' }
    });
    res.json(residents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single resident by MongoDB _id
router.get('/:id', getPublicResident);

// Create resident
router.post('/', async (req, res) => {
  try {
    let imagePath = '';
    if (req.body.image && req.body.image.startsWith('data:image/')) {
      // Parse base64 string
      const matches = req.body.image.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ message: 'Invalid image format' });
      }
      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const data = matches[2];
      const buffer = Buffer.from(data, 'base64');
      const filename = `resident_${Date.now()}.${ext}`;
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/uploads/${filename}`;
    }
    const residentData = { ...req.body, image: imagePath };
    const resident = new Resident(residentData);
    const newResident = await resident.save();
    res.status(201).json(newResident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update resident
router.put('/:residentId', async (req, res) => {
  try {
    const resident = await Resident.findOneAndUpdate(
      { residentId: parseInt(req.params.residentId) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    res.json(resident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete resident
router.delete('/:residentId', async (req, res) => {
  try {
    const resident = await Resident.findOneAndDelete({ residentId: parseInt(req.params.residentId) });
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    res.json({ message: 'Resident deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  router,
  getPublicResident
}; 