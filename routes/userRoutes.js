const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const router = express.Router();
// [RQ03] Lấy danh sách tất cả người dùng
router.get('/ttusers', async (req, res) => {
  try {
      const users = await User.find().select('-password'); // Loại bỏ mật khẩu để bảo mật
      res.json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
});


// [RQ01] Đăng ký người dùng
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Ensure the password is a string
    if (typeof password !== 'string') {
      return res.status(400).json({ message: 'Password must be a string' });
    }

    // Generate a salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user document with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Use the hashed password here
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// [RQ02] Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Không tìm thấy tài khoản" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

// [RQ10] Xem thông tin phòng đã đặt
router.get('/:userId/bookings', async (req, res) => {
    const bookings = await Booking.find({ user: req.params.userId });
    res.json(bookings);
});

module.exports = router;