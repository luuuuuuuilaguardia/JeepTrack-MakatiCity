const mongoose = require('mongoose');

const BoardingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jeepneyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jeepney' },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  boardStopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
  boardTime: { type: Date, default: Date.now },
  method: { type: String, enum: ['auto','manual'], default: 'auto' }
});

module.exports = mongoose.model('Boarding', BoardingSchema);