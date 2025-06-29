const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.send('Test route working!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
