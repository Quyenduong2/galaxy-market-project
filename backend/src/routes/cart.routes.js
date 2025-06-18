const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.post('/remove', cartController.removeFromCart);
router.post('/update-quantity', cartController.updateQuantity);
router.post('/clear', cartController.clearCart);

module.exports = router;