const db = require('../db');
const { v4: uuidv4 } = require('uuid'); 


exports.getAllFlights = (req, res) => {
  const { from_city, to_city, date } = req.query;

  let sql = "SELECT * FROM flight WHERE 1=1 ";
  let params = [];

  if (from_city) {
    sql += " AND from_city = ?";
    params.push(from_city);
  }
  if (to_city) {
    sql += " AND to_city = ?";
    params.push(to_city);
  }
  if (date) {
    
    sql += " AND DATE(departure_time) = ?";
    params.push(date);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};



exports.getFlightById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM flight WHERE flight_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Flight not found.' });
    res.json(results[0]);
  });
};


exports.createFlight = (req, res) => {
  const { from_city, to_city, departure_time, arrival_time, price, seats_total } = req.body;
  const seats_available = seats_total;
  const flight_id = uuidv4();

  validateFlightRules(from_city, to_city, departure_time, arrival_time, null, (err) => {
    if (err) return res.status(400).json({ error: err.message });

    db.query(
      "INSERT INTO flight (flight_id, from_city, to_city, departure_time, arrival_time, price, seats_total, seats_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [flight_id, from_city, to_city, departure_time, arrival_time, price, seats_total, seats_available],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Flight Added", flight_id });
      }
    );
  });
};


exports.updateFlight = (req, res) => {
  const flight_id = req.params.id;
  const { from_city, to_city, departure_time, arrival_time, price, seats_total } = req.body;

  validateFlightRules(from_city, to_city, departure_time, arrival_time, flight_id, (err) => {
    if (err) return res.status(400).json({ error: err.message });

    db.query(
      "UPDATE flight SET from_city=?, to_city=?, departure_time=?, arrival_time=?, price=?, seats_total=?, seats_available=seats_available + (? - seats_total) WHERE flight_id=?",
      [from_city, to_city, departure_time, arrival_time, price, seats_total, seats_total, flight_id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Flight not found." });
        res.json({ message: "Flight Updated" });
      }
    );
  });
};


exports.deleteFlight = (req, res) => {
  const flight_id = req.params.id;
  db.query("DELETE FROM flight WHERE flight_id = ?", [flight_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Flight not found." });
    res.json({ message: "Flight deleted" });
  });
};


function validateFlightRules(from_city, to_city, departure_time, arrival_time, flight_id = null, callback) {
  // Aynı şehirden aynı saatte kalkış olmamalı
  const query1 = `SELECT * FROM flight WHERE from_city = ? AND departure_time = ? ${flight_id ? 'AND flight_id != ?' : ''}`;
  const params1 = flight_id ? [from_city, departure_time, flight_id] : [from_city, departure_time];

  db.query(query1, params1, (err, results) => {
    if (err) return callback(err);

    if (results.length > 0) return callback(new Error('No two flights from the same city can depart at the same hour.'));

    // Aynı şehirde aynı saatte varış olmamalı
    const query2 = `SELECT * FROM flight WHERE to_city = ? AND arrival_time = ? ${flight_id ? 'AND flight_id != ?' : ''}`;
    const params2 = flight_id ? [to_city, arrival_time, flight_id] : [to_city, arrival_time];

    db.query(query2, params2, (err, results2) => {
      if (err) return callback(err);
      if (results2.length > 0) return callback(new Error('No two flights can arrive at the same city at the same arrival time.'));
      callback(null);
    });
  });
}