const Order = require('../models/order.model');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createOrder = async (orderData) => {
  // Logic tạo đơn hàng (có thể gọi API thanh toán)
  return await Order.create(orderData);
};

exports.updateOrderStatus = async (orderId, status) => {
  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) throw new Error('Order not found');
    return order;
  } catch (err) {
    throw err;
  }
}
// exports.processPayment = async (orderData) => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: orderData.total * 100, // Chuyển sang cent
//     currency: 'vnd',
//     metadata: { orderId: orderData._id }
//   });
//   return paymentIntent;
// };