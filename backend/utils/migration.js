const admin = require('firebase-admin');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resident = require('../models/Resident');
const Event = require('../models/Event');
const Record = require('../models/Record');

dotenv.config();

// Initialize Firebase Admin
const serviceAccount = require('../config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const migrateData = async () => {
  try {
    // Migrate Residents
    const residentsSnapshot = await admin.firestore().collection('residents').get();
    for (const doc of residentsSnapshot.docs) {
      const residentData = doc.data();
      await Resident.create(residentData);
    }
    console.log('Residents migrated successfully');

    // Migrate Events
    const eventsSnapshot = await admin.firestore().collection('events').get();
    for (const doc of eventsSnapshot.docs) {
      const eventData = doc.data();
      await Event.create(eventData);
    }
    console.log('Events migrated successfully');

    // Migrate Records
    const recordsSnapshot = await admin.firestore().collection('records').get();
    for (const doc of recordsSnapshot.docs) {
      const recordData = doc.data();
      await Record.create(recordData);
    }
    console.log('Records migrated successfully');

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateData(); 