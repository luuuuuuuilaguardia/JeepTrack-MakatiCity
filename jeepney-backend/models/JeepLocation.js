const mongoose = require('mongoose');

const JeepLocationSchema = new mongoose.Schema({
  jeepneyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jeepney' },
  lat: Number,
  lng: Number,
  speed: Number,
  heading: Number,
  isStopped: Boolean,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JeepLocation', JeepLocationSchema);