const router = require('express').Router();
const {
  getAllEvents,
  getEventsToday,
  createEvent,
  deleteEvent,
} = require('../controllers/eventController');

router.get('/', getAllEvents);
router.get('/today', getEventsToday);
router.post('/', createEvent);
router.delete('/:id', deleteEvent);

module.exports = router; 