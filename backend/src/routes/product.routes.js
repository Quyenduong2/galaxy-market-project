const express = require('express');
const { createProduct, getProducts, getAllProducts } = require('../controllers/product.controller');
const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/', getAllProducts);
router.delete('/all', async (req, res) => {
  try {
    await require('../models/product.model').deleteMany({});
    res.json({ message: 'Đã xóa toàn bộ sản phẩm!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;