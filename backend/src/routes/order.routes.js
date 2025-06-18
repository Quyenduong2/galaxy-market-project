// routes/order.routes.js
const express = require('express');
const router = express.Router();
const Order = require('../controllers/order.controller');
const orderModel = require('../models/order.model');
const auth = require('../config/jwt');

router.post('/', auth, Order.createOrder); // Đặt hàng phải đăng nhập
router.get('/', auth, Order.getAllOrders); // Chỉ admin/user đăng nhập mới xem được

router.post('/', Order.createOrder);
router.get('/', Order.getAllOrders);
router.put('/:id', Order.updateOrderStatus);
router.delete('/:id', Order.deleteOrder);
router.get('/user/:userId', Order.getUserOrders);


router.get('/', async (req, res) => {
  const orders = await orderModel.find({});
  res.json(orders);
});


router.put('/:id', require('../controllers/order.controller').updateOrderStatus); // Sử dụng lại updateOrderStatus

module.exports = router;