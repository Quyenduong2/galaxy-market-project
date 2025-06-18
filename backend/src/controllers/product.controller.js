const Product = require('../models/product.model');

exports.createProduct = async (req, res) => {
    const { name, price, description } = req.body;
    const product = new Product({ name, price, description });
    await product.save();
    res.status(201).json({ message: 'Product created' });
};

exports.getProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};