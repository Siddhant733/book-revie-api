const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const jwt = require('jsonwebtoken');

// Middleware to verify token
function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'jwtSecretKey');
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

// Create Review
router.post('/', auth, async (req, res) => {
  const { bookTitle, review, rating } = req.body;
  try {
    const newReview = new Review({ user: req.user, bookTitle, review, rating });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Read all reviews
router.get('/', async (req, res) => {
  const reviews = await Review.find().populate('user', 'username email');
  res.json(reviews);
});

// Update review
router.put('/:id', auth, async (req, res) => {
  const { bookTitle, review, rating } = req.body;
  try {
    const updated = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { bookTitle, review, rating },
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Review not found or not authorized' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Review.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!deleted) return res.status(404).json({ msg: 'Review not found or not authorized' });
    res.json({ msg: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
