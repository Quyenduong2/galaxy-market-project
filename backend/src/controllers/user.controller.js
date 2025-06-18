const User = require('../models/user.model');
//Lấy danh sách người dùng
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email username phone role createdAt'); // Chỉ lấy các trường cần thiết
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Không thể lấy danh sách người dùng' });
  }
};

// Xóa user theo id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json({ message: 'Đã xóa người dùng thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sửa thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, username } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, phone, username },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sửa thông tin user (user tự sửa)
exports.updateUserSelf = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { name, phone },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};