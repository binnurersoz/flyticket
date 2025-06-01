const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { authenticateToken } = require('../middleware/authMiddleware');


router.get('/:id', flightController.getFlightById);
router.get('/', flightController.getAllFlights);
router.post('/', authenticateToken, flightController.createFlight);
router.put('/:id', authenticateToken, flightController.updateFlight);
router.delete('/:id', authenticateToken, flightController.deleteFlight);

module.exports = router;
