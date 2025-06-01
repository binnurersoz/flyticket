const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/', ticketController.bookTicket);
router.get('/:email', ticketController.getTicketsByEmail);

module.exports = router;

