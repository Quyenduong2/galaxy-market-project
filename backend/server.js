const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const productRoutes = require('./src/routes/product.routes');
// const paymentRoutes = require('./src/routes/payment.routes');
const accountRoutes = require('./src/routes/account.routes');
const orderRoutes = require('./src/routes/order.routes');
const userRoutes = require('./src/routes/user.routes');
const cartRoutes = require('./src/routes/cart.routes');

const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/payment', paymentRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port localhost:${PORT}`);
});