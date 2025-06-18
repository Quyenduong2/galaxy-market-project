const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  name: String,
  total: Number,
  paymentMethod: String,
  items: [
    { title: String, name: String, price: Number, quantity: Number }
  ],
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);

// const orderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   email: { type: String },
//   items: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
//       quantity: { type: Number, required: true }
//     }
//   ],
//   total: { type: Number, required: true },
//   paymentMethod: { type: String, required: true },
//   status: { type: String, default: 'pending' }
// }, { timestamps: true });

// module.exports = mongoose.model('Order', orderSchema);


// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   title: String,
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   products: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//       email: String,
//       total: Number,
//     }
//   ],
//   totalAmount: { type: Number, required: true },
//   status: {
//     type: String,
//     enum: ['pending', 'completed'],
//     default: 'pending'
//   },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Order', orderSchema);