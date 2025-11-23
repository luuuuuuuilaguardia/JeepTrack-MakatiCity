const express = require('express');
const router = express.Router();


router.get('/congestion', (req, res) => {
  res.json({ message: 'Return congestion data per segment (future)' });
});

router.get('/eta', (req, res) => {
  res.json({ message: 'Return ETA per stop (future)' });
});

module.exports = router;