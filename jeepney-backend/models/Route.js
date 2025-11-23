const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: "#FF0000" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Route', RouteSchema);