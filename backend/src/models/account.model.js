const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    seller: { type: String, required: true }    ,     // Tên người bán
    game: { type: String, required: true },           // Tên game
    title: { type: String, required: true },          // Tiêu đề tài khoản
    category: { type: String, required: true },       // Thể loại game
    image: { type: String },                          // Ảnh đại diện
    price: { type: Number, required: true },          // Giá bán
    originalPrice: { type: Number },                  // Giá gốc
    rating: { type: Number, default: 0 },             // Đánh giá
    accounts: { type: Number, default: 1 },           // Số lượng tài khoản (nên là 1)
    level: { type: String },                          // Level tài khoản
    rank: { type: String },                           // Rank
    ar: { type: Number },                             // Adventure Rank (Genshin)
    champions: { type: Number },                      // Số tướng (LMHT)
    agents: { type: Number },                         // Số agent (Valorant)
    characters: { type: Number },                     // Số nhân vật (game khác)
    heroes: { type: Number },                         // Số hero (game khác)
    mmr: { type: String },                            // MMR (nếu có)
    jobs: { type: Number },                           // Số job (game khác)
    hours: { type: Number },                          // Số giờ chơi
    itemLevel: { type: Number },                      // Item level (game khác)
    featured: { type: Boolean, default: false },      // Sản phẩm nổi bật
    status: { type: String, enum: ['available', 'sold'], default: 'available' }, // Trạng thái
    description: { type: String },                    // Mô tả thêm
    username: { type: String, required: true },       // Tên đăng nhập tài khoản game
    password: { type: String, required: true },       // Mật khẩu tài khoản game
    createdAt: { type: Date, default: Date.now },
    ngayHetHan: { type: Date },                         // Ngày hết hạn
});

module.exports = mongoose.model('Account', accountSchema);