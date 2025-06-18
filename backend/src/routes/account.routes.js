const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const Account = require('../models/account.model');

router.get('/available', accountController.getAvailableAccounts);
router.post('/buy/:id', accountController.buyAccount);
router.get('/stats', accountController.getStats);

// Lấy danh sách tất cả tài khoản
router.get('/', async (req, res) => {
  const accounts = await Account.find({});
  res.json(accounts);
});

// Thêm tài khoản mới
router.post('/', async (req, res) => {
  try {
    const { _id, ...accountData } = req.body;
    const account = new Account(accountData);
    await account.save();
    res.status(201).json(account);
  } catch (err) {
    console.error("Lỗi khi tạo tài khoản:", err); // Log lỗi đầy đủ
    res.status(400).json({ message: err.message });
  }
});

// Sửa tài khoản
router.put('/:id', accountController.updateAccount);

// Xóa tài khoản
router.delete('/:id', accountController.deleteAccount);

// Lấy danh sách tài khoản đã bán
router.get('/sold', accountController.getSoldAccounts);

module.exports = router;