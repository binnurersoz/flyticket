const db = require('../db');

exports.getAllCities = (req, res) => {
  const query = 'SELECT * FROM City';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getCityById = (req, res) => {
  const query = 'SELECT * FROM City WHERE city_id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'City not found' });
    res.json(results[0]);
  });
};

exports.createCity = (req, res) => {
  const { city_name } = req.body;
  const query = 'INSERT INTO City (city_name) VALUES (?)';
  db.query(query, [city_name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'City added', city_id: result.insertId });
  });
};

exports.updateCity = (req, res) => {
  const { city_name } = req.body;
  const query = 'UPDATE City SET city_name = ? WHERE city_id = ?';
  db.query(query, [city_name, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'City updated' });
  });
};

exports.deleteCity = (req, res) => {
  const query = 'DELETE FROM City WHERE city_id = ?';
  db.query(query, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'City deleted' });
  });
};
