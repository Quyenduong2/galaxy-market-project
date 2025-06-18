const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: String,
    category: String,
    image: String,
    price: String,
    originalPrice: String,
    rating: Number,
    accounts: Number,
    level: String,
    rank: String,
    ar: Number,
    champions: Number,
    agents: Number,
    characters: Number,
    heroes: Number,
    mmr: String,
    jobs: Number,
    hours: Number,
    itemLevel: Number,
    featured: Boolean
});

module.exports = mongoose.model('Product', ProductSchema);