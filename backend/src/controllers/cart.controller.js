const Cart = require('../models/cart.model');

exports.addToCart = async (req, res) => {
  try {
    const { user, items } = req.body;
    let cart = await Cart.findOne({ user });

    if (!cart) {
      // Nếu chưa có cart, tạo mới
      cart = new Cart({
        user,
        items,
      });
    } else {
      // Nếu đã có cart, cập nhật hoặc thêm sản phẩm
      items.forEach(newItem => {
        const existingItem = cart.items.find(
          item => item.product.toString() === newItem.product
        );
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          cart.items.push(newItem);
        }
      });
    }

    await cart.save();
    // Populate để trả về thông tin sản phẩm đầy đủ
    await cart.populate('items.product');
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm vào giỏ hàng", error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { user } = req.query;
    const cart = await Cart.findOne({ user }).populate('items.product');
    if (!cart) {
      return res.json({ items: [] }); // Đảm bảo luôn trả về object có items
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { user, productId } = req.body;
    const cart = await Cart.findOne({ user });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { user, productId, quantity } = req.body;
    const cart = await Cart.findOne({ user });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { user } = req.body;
    const cart = await Cart.findOne({ user });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = [];
    await cart.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};