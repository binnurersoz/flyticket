const db = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.bookTicket = (req, res) => {
  const { passenger_name, passenger_surname, passenger_email, flight_id, seat_number } = req.body;

  
  db.query("SELECT * FROM flight WHERE flight_id = ?", [flight_id], (err, flights) => {
    if (err) return res.status(500).json({ error: err.message });
    if (flights.length === 0) return res.status(404).json({ error: "Flight not found." });

    const flight = flights[0];

    if (flight.seats_available <= 0) return res.status(400).json({ error: "No available seats on this flight." });

    
    if (seat_number) {
      db.query(
        "SELECT * FROM ticket WHERE flight_id = ? AND seat_number = ?",
        [flight_id, seat_number],
        (err, seatResults) => {
          if (err) return res.status(500).json({ error: err.message });
          if (seatResults.length > 0) return res.status(400).json({ error: "The selected seat is already taken." });

          
          insertTicket();
        }
      );
    } else {
      
      insertTicket();
    }

    function insertTicket() {
      const ticket_id = uuidv4();

      db.query(
        "INSERT INTO ticket (ticket_id, passenger_name, passenger_surname, passenger_email, flight_id, seat_number) VALUES (?, ?, ?, ?, ?, ?)",
        [ticket_id, passenger_name, passenger_surname, passenger_email, flight_id, seat_number],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          // seats_available'ı azalt
          db.query(
            "UPDATE flight SET seats_available = seats_available - 1 WHERE flight_id = ?",
            [flight_id],
            (err) => {
              if (err) return res.status(500).json({ error: err.message });
              res.status(201).json({ message: "Ticket successfully booked.", ticket_id });
            }
          );
        }
      );
    }
  });
};

exports.getTicketsByEmail = (req, res) => {
  const passenger_email = req.params.email;

  db.query(
    "SELECT t.*, f.from_city, f.to_city, f.departure_time, f.arrival_time, f.price FROM ticket t JOIN flight f ON t.flight_id = f.flight_id WHERE t.passenger_email = ?",
    [passenger_email],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};
