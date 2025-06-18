const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { updateOrderStatus } = require('../services/payment.service');

router.post('/checkout', paymentController.createOrder);

// Thêm route để cập nhật trạng thái đơn hàng
router.put('/orders/:id', paymentController.updateOrderStatus);

// Thêm webhook (tuỳ chọn, nếu dùng dịch vụ thanh toán bên thứ ba)
router.post('/webhook', async (req, res) => {
  try {
    const paymentData = req.body;
    if (paymentData.status === 'succeeded') {
      await updateOrderStatus(paymentData.orderId, 'completed');
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('Webhook processing failed');
  }
});

module.exports = router;

// không xài file này