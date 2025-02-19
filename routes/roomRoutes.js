const express = require('express');
const Room = require('../model/roomModel');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const rooms = await Room.find();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi truy xuất dữ liệu' });
    }
  });

// [RQ03] Xem thông tin phòng
router.get('/:id', async (req, res) => {
    const room = await Room.findById(req.params.id);
    res.json(room);
});

// [RQ08] Đánh giá phòng
router.post('/:id/review', async (req, res) => {
    const { userId, rating, comment } = req.body;
    await Room.findByIdAndUpdate(req.params.id, { $push: { reviews: { userId, rating, comment } } });
    res.json({ message: "Đánh giá đã được ghi nhận!" });
});

// [RQ22] Cập nhật chính sách giá phòng
router.put('/:id/price', async (req, res) => {
    const { price } = req.body;
    await Room.findByIdAndUpdate(req.params.id, { price });
    res.json({ message: "Giá phòng đã được cập nhật!" });
});

module.exports = router;