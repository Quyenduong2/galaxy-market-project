const Account = require('../models/account.model');
const Order = require('../models/order.model');
const User = require('../models/user.model');

// Lấy danh sách tài khoản còn bán
exports.getAvailableAccounts = async (req, res) => {
  // try {
  //   const { game } = req.query;
  //   const filter = { status: 'available' };
  //   if (game) filter.game = game;
  //   const accounts = await Account.find(filter);
  //   res.json(accounts);
  // } catch (err) {
  //   res.status(500).json({ message: err.message });
  // }
    try {
    const { game } = req.query;
    const filter = { status: 'available' };

    // Lọc tài khoản chưa hết hạn
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    filter.$or = [
      { ngayHetHan: { $exists: false } },
      { ngayHetHan: { $gte: today } }
    ];

    if (game) filter.game = game;
    const accounts = await Account.find(filter);
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Mua tài khoản (chuyển trạng thái đã bán)
exports.buyAccount = async (req, res) => {
  const { id } = req.params;
  const account = await Account.findByIdAndUpdate(id, { status: 'sold' }, { new: true });
  if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' });
  res.json({ message: 'Mua thành công', account });
};

// Thống kê cho dashboard admin
exports.getStats = async (req, res) => {
  // Tổng doanh thu = tổng price của các account đã bán
  const soldAccounts = await Account.find({ status: 'sold' });
  const totalRevenue = soldAccounts.reduce((sum, acc) => sum + (acc.price || 0), 0);

  // Đếm số đơn hàng đã hoàn thành (nếu muốn)
  const totalOrders = await Order.countDocuments({ status: 'completed' });

  // Đếm sản phẩm còn bán
  const totalProducts = await Account.countDocuments({ status: 'available' });

  // Đếm user
  const totalUsers = await User.countDocuments();

  res.json({
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers
  });
};

// Thêm tài khoản mới
exports.createAccount = async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Sửa tài khoản
exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!account) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    res.json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa tài khoản
exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    res.json({ message: 'Đã xóa tài khoản thành công' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSoldAccounts = async (req, res) => {
  try {
    const soldAccounts = await Account.find({ status: 'sold' });
    res.json(soldAccounts);
  } catch (err) {
    res.status(500).json({ message: 'Không thể lấy danh sách tài khoản đã bán' });
  }
};