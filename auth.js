const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();
const users = [];  // In-memory store; replace with DB model

const SECRET = process.env.ACCESS_TOKEN_SECRET;

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email & password required' });
  if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Email already exists' });
  const hashed = await bcrypt.hash(password, 10);
  users.push({ id: Date.now().toString(), email, password: hashed });
  res.status(201).json({ message: 'User registered successfully' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ UserId: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Protected route
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected Access Granted', user: req.user });
});

module.exports = router;
