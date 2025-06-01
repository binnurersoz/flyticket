const jwt = require('jsonwebtoken');
const SECRET_KEY = "supersecretkeyforjwt"; 

const adminKey = "adminkey";

function isAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (key && key === adminKey) {
    next();
  } else {
    res.status(403).json({ error: 'Admin privileges required.' });
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Access token is required." });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token." });
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, isAdmin };
