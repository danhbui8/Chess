const express = require('express');
const router = express.Router();
const Opening = require('../models/Opening');

// GET /api/openings — lấy tất cả opening
router.get('/', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const openings = await Opening.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, data: openings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/openings/:slug — lấy 1 opening theo slug
router.get('/:slug', async (req, res) => {
  try {
    const opening = await Opening.findOne({ slug: req.params.slug });
    if (!opening) return res.status(404).json({ success: false, message: 'Opening not found' });
    res.json({ success: true, data: opening });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/openings — tạo opening mới (dùng khi seed thêm)
router.post('/', async (req, res) => {
  try {
    const opening = new Opening(req.body);
    await opening.save();
    res.status(201).json({ success: true, data: opening });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/openings/:slug — cập nhật opening
router.put('/:slug', async (req, res) => {
  try {
    const opening = await Opening.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!opening) return res.status(404).json({ success: false, message: 'Opening not found' });
    res.json({ success: true, data: opening });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
