const express = require('express');
const router = express.Router();

// Example dummy route to test
router.get('/', (req, res) => {
  res.send('Books API works!');
});

module.exports = router;
