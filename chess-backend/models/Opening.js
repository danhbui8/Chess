const mongoose = require('mongoose');

const variationSchema = new mongoose.Schema({
  name: String,
  moves: String,
  desc: String,
}, { _id: false });

const moveSchema = new mongoose.Schema({
  w: String,
  b: String,
}, { _id: false });

const openingSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // e.g. 'ruy-lopez'
  name: { type: String, required: true },
  aka: String,
  eco: String,
  category: { type: String, enum: ['Open', 'Semi-Open', 'Closed', 'Indian'] },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  moves: [moveSchema],
  why: String,
  ideas: String,
  pros: [String],
  cons: [String],
  variations: [variationSchema],
  tip: String,
}, { timestamps: true });

module.exports = mongoose.model('Opening', openingSchema);
