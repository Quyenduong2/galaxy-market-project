const mongoose = require('mongoose');
const Product = require('../models/product.model');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const categories = [
  { value: "MOBA", label: "MOBA" },
  { value: "FPS", label: "FPS" },
  { value: "RPG", label: "RPG" },
  { value: "Strategy", label: "Strategy" },
  { value: "Adventure", label: "Adventure" },
  { value: "Simulation", label: "Simulation" },
];

const ranks = ["Sắt", "Đồng", "Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Cao Thủ", "Thách Đấu"];
const images = [
  "https://via.placeholder.com/300x200?text=Game+1",
  "https://via.placeholder.com/300x200?text=Game+2",
  "https://via.placeholder.com/300x200?text=Game+3",
  "https://via.placeholder.com/300x200?text=Game+4",
  "https://via.placeholder.com/300x200?text=Game+5",
  "https://via.placeholder.com/300x200?text=Game+6",
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPrice() {
  const price = randomInt(200000, 5000000);
  return price.toLocaleString();
}

function randomOriginalPrice(price) {
  const original = parseInt(price.replace(/,/g, "")) + randomInt(50000, 500000);
  return original.toLocaleString();
}


// Thêm seed cho collection accounts (mỗi tài khoản là 1 document, đủ trường như sampleProducts)
const sampleAccounts = Array.from({ length: 5 }).map((_, i) => {
  const category = categories[randomInt(0, categories.length - 1)].value;
  const price = randomInt(200000, 5000000); // Number
  const originalPrice = price + randomInt(50000, 500000); // Number
  return {
    seller: `Seller ${i + 1}`,
    game: `Tai khoản game ${category}`,
    title: `Full Champ + Vip12 + No. ${i + 1}`,
    category,
    image: images[i % images.length],
    price,
    originalPrice,
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    accounts: randomInt(10, 500),
    level: `Level ${randomInt(1, 100)}`,
    rank: ranks[randomInt(0, ranks.length - 1)],
    ar: randomInt(1, 60),
    champions: randomInt(10, 160),
    agents: randomInt(5, 25),
    characters: randomInt(5, 50),
    heroes: randomInt(10, 120),
    mmr: `${randomInt(1000, 3000)}`,
    jobs: randomInt(1, 10),
    hours: randomInt(10, 2000),
    itemLevel: randomInt(100, 1600),
    featured: i % 7 === 0,
    status: "available",
    description: `Tài khoản game mẫu số ${i + 1}`,
    username: `user_account_${i + 1}`,
    password: `pass${1000 + i}`
  };
});


const users = [
  {
    username: "user1",
    email: "user1@gmail.com",
    password: "123456", 
    role: "user",
    name: "Người Dùng 1"
  },
  {
    username: "admin1",
    email: "admin@gmail.com",
    password: "123456", 
    role: "admin",
    name: "Quản Trị Viên"
  }
];


async function seed() {
  await mongoose.connect(MONGO_URI);
  
  const Account = require('../models/account.model');
  await Account.deleteMany({});
  await Account.insertMany(sampleAccounts);
  
  console.log('Đã tạo 5 tài khoản game mẫu!');


  const User = require('../models/user.model');
  await User.deleteMany({});

  // Hash password cho từng user
  for (let user of users) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  await User.insertMany(users);

  

  process.exit();
}

seed();