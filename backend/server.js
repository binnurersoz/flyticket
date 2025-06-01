
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const cityRoutes = require('./routes/cityRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const flightRoutes = require('./routes/flightRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/cities', cityRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/admin', adminRoutes);

// Server listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
