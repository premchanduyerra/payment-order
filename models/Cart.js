const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: String,
    productName: String,
    productId: String,
    Amount: Number,
    gst:Number
});
module.exports= mongoose.model("CartProduct", cartSchema);