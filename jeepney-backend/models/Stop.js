const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  sequence: { type: Number, required: true }
});

module.exports = mongoose.model('Stop', StopSchema);