const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { email, password, name, username, phone } = req.body;
    if (!email || !password || !name || !username) {
      return res.status(400).json({ message: 'Thiếu thông tin đăng ký' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name, username, phone });
    res.status(201).json({ user: { email: user.email, name: user.name, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Đăng ký thất bại' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // Trả về JSON nếu thiếu trường
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Trả về JSON nếu không tìm thấy user
      return res.status(401).json({ message: "Tài khoản không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Trả về JSON nếu sai mật khẩu
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    // Tạo JWT thực sự
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Không trả về password
    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        email: user.email,
        phone: user.phone || ''
      },
      token
    });
  } catch (err) {
    // Trả về JSON nếu có lỗi server
    return res.status(500).json({ message: "Lỗi server" });
  }
};