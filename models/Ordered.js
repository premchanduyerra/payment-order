const mongoose = require('mongoose');

const orderedSchema = new mongoose.Schema({
    userId: String,
    productIds:[String],
    address:{
        firstName: String,
        lastName: String,
        middleName: String,
        company: String,
        email: String,
        phone: String,
        country: String,
        city: String,
        state: String,
        postalCode: String,
        address: String,
    },
    deliveryType:{
    type: String,
    amount: Number
    },
    isDelivered:Boolean,
    isPaid:Boolean
});
module.exports= mongoose.model("order", orderedSchema);