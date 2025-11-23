const mongoose = require('mongoose');

const JeepneySchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plateNumber: { type: String, required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  capacity: { type: Number, default: 16 },
  status: { type: String, enum: ['online','offline'], default: 'offline' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Jeepney', JeepneySchema);