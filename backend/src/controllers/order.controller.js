const sendMail = require('../utils/sendMail');
const Order = require('../models/order.model');
const Account = require('../models/account.model');
const User = require('../models/user.model');
// exports.createOrder = async (req, res) => {
//   try {
//     console.log('==> Đã vào createOrder');
//     console.log('Order body:', req.body);
//     const { user, email, name, total, paymentMethod, items } = req.body;
//     const order = await Order.create({ user, email, name, total, paymentMethod, items, status: 'pending' });
//     console.log('Order đã tạo:', order);
//     // Đánh dấu các tài khoản đã bán || (Nếu muốn xóa tài khoản khỏi DB thay vì cập nhật status, dùng findByIdAndDelete thay cho findByIdAndUpdate)
//     for (const item of items) {
//       await Account.findByIdAndUpdate(item.product, { status: 'sold' });
//     }
//     res.status(201).json({ success: true, order });
//   } catch (err) {
//     console.error('Lỗi tạo order:', err);
//     res.status(500).json({ success: false, message: 'Tạo đơn hàng thất bại' });
//   }
// };

exports.createOrder = async (req, res) => {
  try {
    const { user, email, name, total, paymentMethod, items } = req.body;
    // 1. Tạo đơn hàng
    const order = await Order.create({ user, email, name, total, paymentMethod, items, status: 'pending' });

    // 2. Đánh dấu các tài khoản đã bán
    await Promise.all(
      items.map(item => Account.findByIdAndUpdate(item.product, { status: 'sold' }))
    );

    // 3. Lấy thông tin user để gửi mail (nếu user là ObjectId)
    let userInfo = null;
    if (user) {
      userInfo = await User.findById(user);
    }

    // 4. Lấy thông tin tài khoản thực tế cho từng item
    const accountIds = items.map(item => item.product);
    const accounts = await Account.find({ _id: { $in: accountIds } });

    // 5. Gửi mail xác nhận
    const mailTo = userInfo?.email || email;
    const mailName = userInfo?.name || name;
    let itemsHtml = '';
    for (const item of items) {
      const acc = accounts.find(a => a._id.toString() === item.product);
      itemsHtml += `
        <tr>
          <td>${item.title}</td>
          <td>${item.price?.toLocaleString()}đ</td>
          <td>${acc?.username || ''}</td>
          <td>${acc?.password || ''}</td>
        </tr>
      `;
    }
    const html = `
      <h2>Xin chào ${mailName},</h2>
      <p>Cảm ơn bạn đã mua tài khoản tại Galaxy Market!</p>
      <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
      <p><strong>Phương thức thanh toán:</strong> ${paymentMethod}</p>
      <p><strong>Tổng tiền:</strong> ${total.toLocaleString()}đ</p>
      <h3>Chi tiết sản phẩm:</h3>
      <table border="1" cellpadding="6" style="border-collapse:collapse;">
        <tr>
          <th>Tên tài khoản mua</th>
          <th>Giá</th>
          <th>Tài khoản</th>
          <th>Mật khẩu</th>
        </tr>
        ${itemsHtml}
      </table>
      <p>Chúc bạn trải nghiệm vui vẻ!</p>
      <p>Galaxy Market</p>
    `;
    await sendMail(mailTo, 'Xác nhận đơn hàng Galaxy Market', html);

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Lỗi tạo order:', err);
    res.status(500).json({ success: false, message: 'Tạo đơn hàng thất bại' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
    }

    // Gửi email xác nhận khi trạng thái là completed
    if (status === 'completed') {
      await sendMail(
        order.email,
        'Xác nhận đơn hàng Galaxy Market',
        `<h3>Cảm ơn bạn đã mua hàng!</h3>
        <p>Mã đơn hàng: ${order._id}</p>
        <p>Tổng tiền: ${order.total.toLocaleString()}đ</p>
        <p>Phương thức thanh toán: ${order.paymentMethod}</p>`
      );
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Cập nhật trạng thái thất bại' });
  }
};

exports.handlePaymentWebhook = async (req, res) => {
  try {
    const paymentData = req.body;
    if (paymentData.status === 'succeeded') {
      await paymentService.updateOrderStatus(paymentData.orderId, 'completed');
    }
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// lịch sử mua hàng của user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Không thể lấy lịch sử mua hàng' });
  }
};

// Lấy tất cả đơn hàng (cho admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};