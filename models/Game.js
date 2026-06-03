const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  pgn: { type: String, required: true },      // full PGN string e.g. "1. e4 e5 2. Nf3 Nc6"
  moves: [String],                             // array of SAN moves
  result: {
    type: String,
    enum: ['1-0', '0-1', '1/2-1/2', '*'],     // white wins, black wins, draw, ongoing
    default: '*',
  },
  status: {
    type: String,
    enum: ['checkmate', 'stalemate', 'playing', 'resigned'],
    default: 'playing',
  },
  totalMoves: { type: Number, default: 0 },
  note: { type: String, default: '' },         // optional note from user
}, { timestamps: true });                      // adds createdAt, updatedAt

// Virtual: move count formatted as "X nước"
gameSchema.virtual('moveCount').get(function () {
  return Math.ceil(this.moves.length / 2);
});

module.exports = mongoose.model('Game', gameSchema);
