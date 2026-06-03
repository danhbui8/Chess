const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// GET /api/games — lấy lịch sử ván cờ (mới nhất trước)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const games = await Game.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v');
    res.json({ success: true, count: games.length, data: games });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/games/:id — lấy 1 ván cụ thể
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ success: false, message: 'Game not found' });
    res.json({ success: true, data: game });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/games — lưu ván cờ mới
router.post('/', async (req, res) => {
  try {
    const { moves, status, note } = req.body;

    if (!moves || !Array.isArray(moves) || moves.length === 0) {
      return res.status(400).json({ success: false, message: 'moves array is required' });
    }

    // Tính result từ status
    const resultMap = {
      checkmate: moves.length % 2 === 1 ? '1-0' : '0-1',
      stalemate: '1/2-1/2',
      playing: '*',
      resigned: '*',
    };

    // Build PGN string
    let pgn = '';
    for (let i = 0; i < moves.length; i++) {
      if (i % 2 === 0) pgn += `${Math.floor(i / 2) + 1}. `;
      pgn += moves[i] + ' ';
    }
    pgn = pgn.trim();

    const game = new Game({
      pgn,
      moves,
      result: resultMap[status] || '*',
      status: status || 'playing',
      totalMoves: Math.ceil(moves.length / 2),
      note: note || '',
    });

    await game.save();
    res.status(201).json({ success: true, data: game });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/games/:id/note — cập nhật ghi chú ván cờ
router.patch('/:id/note', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { note: req.body.note },
      { new: true }
    );
    if (!game) return res.status(404).json({ success: false, message: 'Game not found' });
    res.json({ success: true, data: game });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/games/:id — xoá ván cờ
router.delete('/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ success: false, message: 'Game not found' });
    res.json({ success: true, message: 'Game deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/games — xoá tất cả ván cờ
router.delete('/', async (req, res) => {
  try {
    const result = await Game.deleteMany({});
    res.json({ success: true, message: `Deleted ${result.deletedCount} games` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
