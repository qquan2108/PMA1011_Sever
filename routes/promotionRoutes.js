const express = require('express');
const Promotion = require('../model/promotionModel');

const router = express.Router();

// [RQ27] Quản lý chương trình khuyến mãi
router.post('/add', async (req, res) => {
    const { name, discount, description } = req.body;
    const promotion = new Promotion({ name, discount, description });
    await promotion.save();
    res.json({ message: "Khuyến mãi đã được thêm!" });
});

// [RQ09] Nhận thông báo khuyến mãi
router.get('/notify/:userId', async (req, res) => {
    const promotions = await Promotion.find();
    res.json(promotions);
});

module.exports = router;