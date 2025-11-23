const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Jeepney = require('../models/Jeepney');
const Boarding = require('../models/Boarding');

// Get active jeepneys by route
router.get('/jeeps', auth, async (req, res) => {
  const { route } = req.query;
  try {
    const jeeps = await Jeepney.find({ status: 'online' }).populate('driverId').populate('routeId');
    res.json(jeeps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Auto-detect boarding
router.post('/board-detection', auth, async (req, res) => {
  const { userId, jeepId } = req.body;
  try {
    const boarding = new Boarding({ userId, jeepneyId: jeepId, method: 'auto' });
    await boarding.save();
    res.json({ success: true, boarding });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/report', auth, (req, res) => {
  // on going development
  res.json({ success: true });
});

module.exports = router;