### 1. Cài đặt môi trường

Trước tiên, bạn cần cài đặt Node.js và MongoDB trên máy tính của mình. Sau đó, tạo một thư mục mới cho dự án của bạn và cài đặt các gói cần thiết.

```bash
mkdir my-ecommerce-app
cd my-ecommerce-app
npm init -y
npm install express mongoose jsonwebtoken nodemailer dotenv body-parser cors
```

### 2. Cấu trúc thư mục

Tạo cấu trúc thư mục như sau:

```
my-ecommerce-app/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   └── paymentController.js
│
├── models/
│   ├── User.js
│   └── Product.js
│
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── paymentRoutes.js
│
├── .env
├── server.js
└── package.json
```

### 3. Cấu hình MongoDB ! xong

Tạo file `config/db.js` để kết nối với MongoDB.

```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
```

### 4. Tạo mô hình dữ liệu ! xong

Tạo file `models/User.js` cho người dùng.

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);
```

Tạo file `models/Product.js` cho sản phẩm.

```javascript
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model('Product', ProductSchema);
```

### 5. Tạo API cho người dùng

Tạo file `controllers/authController.js`.

```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};
```

Tạo file `routes/authRoutes.js`.

```javascript
const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;
```

### 6. Tạo API cho sản phẩm

Tạo file `controllers/productController.js`.

```javascript
const Product = require('../models/Product');

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
```

Tạo file `routes/productRoutes.js`.

```javascript
const express = require('express');
const { createProduct, getProducts } = require('../controllers/productController');
const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);

module.exports = router;
```

### 7. Gửi email

Tạo file `controllers/emailController.js`.

```javascript
const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
};
```

### 8. Tạo API thanh toán

Tạo file `controllers/paymentController.js`.

```javascript
const { sendEmail } = require('./emailController');

exports.processPayment = async (req, res) => {
    const { email, amount } = req.body;
    // Giả lập thanh toán thành công
    await sendEmail(email, 'Payment Successful', `Your payment of $${amount} was successful.`);
    res.json({ message: 'Payment processed' });
};
```

Tạo file `routes/paymentRoutes.js`.

```javascript
const express = require('express');
const { processPayment } = require('../controllers/paymentController');
const router = express.Router();

router.post('/', processPayment);

module.exports = router;
```

### 9. Tạo file server.js

Tạo file `server.js`.

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

### 10. Tạo file .env

Tạo file `.env` để lưu trữ các biến môi trường.

```
MONGO_URI=mongodb://localhost:27017/my-ecommerce
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 11. Chạy ứng dụng

Chạy ứng dụng bằng lệnh:

```bash
node server.js
```

### 12. Kiểm tra API

Bạn có thể sử dụng Postman hoặc bất kỳ công cụ nào khác để kiểm tra các API:

- **Đăng ký người dùng**: POST `http://localhost:5000/api/auth/register`
- **Đăng nhập**: POST `http://localhost:5000/api/auth/login`
- **Tạo sản phẩm**: POST `http://localhost:5000/api/products`
- **Lấy danh sách sản phẩm**: GET `http://localhost:5000/api/products`
- **Xử lý thanh toán**: POST `http://localhost:5000/api/payment`

### Kết luận

Trên đây là hướng dẫn chi tiết để xây dựng một ứng dụng back-end cơ bản với Node.js, MongoDB, API, JWT, gửi email và thanh toán. Bạn có thể mở rộng và cải thiện ứng dụng này theo nhu cầu của mình.