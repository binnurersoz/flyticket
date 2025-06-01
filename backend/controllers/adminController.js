const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "supersecretkeyforjwt";

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  db.query("SELECT * FROM admin WHERE username = ?", [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: "Admin user not found." });

    const admin = results[0];

    console.log("Retrieved admin:", admin);
    console.log("Provided password:", password);

    if (!admin.password) {
      return res.status(500).json({ error: "Password data is missing from the database." });
    }

    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!isMatch) return res.status(401).json({ error: "Incorrect password." });

      const token = jwt.sign({ username: admin.username }, SECRET_KEY, { expiresIn: "2h" });
      res.json({ token });
    });
  });
};
