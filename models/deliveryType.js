
const mongoose = require('mongoose');
const deliveryTypeSchema = new mongoose.Schema({
    userId: String,
    type: String,
    amount: Number
});
module.exports = mongoose.model("deliveryType", deliveryTypeSchema);