const Resident = require('../models/Resident');
const Counter = require('../models/Counter');

// Get all residents
exports.getAllResidents = async (req, res) => {
  try {
    const residents = await Resident.find();
    res.status(200).json(residents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single resident
exports.getResident = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Resident ID is required' });
    }

    const resident = await Resident.findOne({ residentId: parseInt(id) });
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    res.status(200).json(resident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create resident
exports.createResident = async (req, res) => {
  try {
    console.log('=== Create Resident Request ===');
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const requiredFields = ['firstname', 'lastname', 'fullname', 'birthdate', 'sex', 'civilstatus', 'address', 'image', 'PWD', 'fourpsmember', 'registervoter', 'occupancystatus'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields 
      });
    }

    // Validate data types
    if (typeof req.body.PWD !== 'boolean') {
      req.body.PWD = req.body.PWD === 'true' || req.body.PWD === true;
    }
    if (typeof req.body.fourpsmember !== 'boolean') {
      req.body.fourpsmember = req.body.fourpsmember === 'true' || req.body.fourpsmember === true;
    }
    if (typeof req.body.registervoter !== 'boolean') {
      req.body.registervoter = req.body.registervoter === 'true' || req.body.registervoter === true;
    }

    // Get the next residentId
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'residentId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    // Set the residentId in the request body
    req.body.residentId = counter.seq;

    console.log('Creating new resident...');
    const newResident = new Resident(req.body);
    console.log('Saving resident to database...');
    const savedResident = await newResident.save();
    console.log('Successfully saved resident:', savedResident);
    res.status(201).json(savedResident);
  } catch (error) {
    console.error('Error creating resident:', error);
    console.error('Error stack:', error.stack);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A resident with this information already exists',
        field: Object.keys(error.keyPattern)[0]
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create resident',
      error: error.message,
      details: error.errors || 'Unknown error occurred'
    });
  }
};

// Update resident
exports.updateResident = async (req, res) => {
  try {
    const { id } = req.query;
    console.log('Updating resident with ID:', id);
    
    if (!id) {
      console.log('No ID provided for update');
      return res.status(400).json({ message: 'Resident ID is required' });
    }
    
    const updatedResident = await Resident.findOneAndUpdate(
      { residentId: parseInt(id) },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!updatedResident) {
      console.log('No resident found with ID:', id);
      return res.status(404).json({ message: 'Resident not found' });
    }
    
    console.log('Successfully updated resident:', updatedResident);
    res.status(200).json(updatedResident);
  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(500).json({ 
      message: 'Failed to update resident',
      error: error.message 
    });
  }
};

// Delete resident
exports.deleteResident = async (req, res) => {
  try {
    const { id } = req.query;
    console.log('Attempting to delete resident with ID:', id);
    
    if (!id) {
      console.log('No ID provided for deletion');
      return res.status(400).json({ message: 'Resident ID is required' });
    }
    
    const deletedResident = await Resident.findOneAndDelete({ residentId: parseInt(id) });
    console.log('Delete operation result:', deletedResident);
    
    if (!deletedResident) {
      console.log('No resident found with ID:', id);
      return res.status(404).json({ message: 'Resident not found' });
    }
    
    console.log('Successfully deleted resident:', deletedResident);
    res.status(200).json({ 
      message: 'Resident deleted successfully',
      deletedResident 
    });
  } catch (error) {
    console.error('Error deleting resident:', error);
    res.status(500).json({ 
      message: 'Failed to delete resident',
      error: error.message 
    });
  }
}; 