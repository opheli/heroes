const mongoose = require("mongoose")

const heroSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    power: [String],
    color: String,
    isAlive: Boolean,
    age: Number,
    image: String,
    created: { type: Date, default: Date.now }
})

module.exports = mongoose.model("heros", heroSchema)