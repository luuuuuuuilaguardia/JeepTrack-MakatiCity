const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Route = require('../models/Route');
const Stop = require('../models/Stop');

// Get all routes
router.get('/', async (req, res) => {
  const routes = await Route.find();
  res.json(routes);
});

// Get stops for a route
router.get('/:id/stops', async (req, res) => {
  const stops = await Stop.find({ routeId: req.params.id }).sort({ sequence: 1 });
  res.json(stops);
});

// Create route (Admin)
router.post('/', auth, async (req, res) => {
  const { name, color } = req.body;
  const route = new Route({ name, color });
  await route.save();
  res.json(route);
});

// Add stop (Admin)
router.post('/stops', auth, async (req, res) => {
  const { routeId, name, lat, lng, sequence } = req.body;
  const stop = new Stop({ routeId, name, lat, lng, sequence });
  await stop.save();
  res.json(stop);
});

module.exports = router;