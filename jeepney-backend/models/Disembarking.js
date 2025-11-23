const mongoose = require('mongoose');

const DisembarkingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jeepneyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jeepney' },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  dropStopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
  dropTime: { type: Date, default: Date.now },
  method: { type: String, enum: ['auto','manual'], default: 'auto' }
});

module.exports = mongoose.model('Disembarking', DisembarkingSchema);