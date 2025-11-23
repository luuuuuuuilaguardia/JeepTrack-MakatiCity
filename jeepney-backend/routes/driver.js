const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Jeepney = require('../models/Jeepney');
const JeepLocation = require('../models/JeepLocation');
const Route = require('../models/Route');

// Update driver location
router.post('/location', auth, async (req, res) => {
  const { jeepId, lat, lng, speed, heading } = req.body;
  try {
    const loc = new JeepLocation({ jeepneyId: jeepId, lat, lng, speed, heading, isStopped: speed < 5 });
    await loc.save();
    res.json({ success: true, loc });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update status
router.post('/status', auth, async (req, res) => {
  const { jeepId, status } = req.body;
  try {
    const jeep = await Jeepney.findByIdAndUpdate(jeepId, { status }, { new: true });
    res.json({ success: true, jeep });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update passenger count
router.post('/passenger-count', auth, async (req, res) => {
  const { jeepId, count } = req.body;
  try {
    const jeep = await Jeepney.findByIdAndUpdate(jeepId, { passengerCount: count }, { new: true });
    res.json({ success: true, jeep });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Register new jeepney
router.post('/jeep', auth, async (req, res) => {
  const { driverId, plateNumber, routeId, capacity } = req.body;
  try {
    const route = await Route.findById(routeId);
    if (!route) return res.status(400).json({ message: 'Route not found' });

    const jeep = new Jeepney({ driverId, plateNumber, routeId, capacity });
    await jeep.save();
    res.json({ success: true, jeep });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;