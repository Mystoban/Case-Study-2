const router = require('express').Router();
const Record = require('../models/Record');

// Get all records
router.get('/', async (req, res) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create record
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { clientname, lettername, letterprice, staffname, kagawadname } = req.body;
    if (!clientname || !lettername || !letterprice || !staffname || !kagawadname) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newRecord = new Record(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ 
      message: 'Error creating record', 
      error: error.message 
    });
  }
});

module.exports = router; 