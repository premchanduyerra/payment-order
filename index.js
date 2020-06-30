const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
const mongoose = require('mongoose');
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , crossOriginURL1);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin123:admin123@cluster0-0tqob.mongodb.net/rent2trustDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



////......SCHEMASS.......................................
//product Schema.........................................
var Product=require("./models/Product.js");
//address Schema ........................................
var Address=require("./models/Address.js");
//.........delivery type schema..........................
var deliveryType=require("./models/deliveryType.js");
//.........cartProduct  schema..........................
var Cart=require("./models/Cart.js");
//........orderedSchema.................................
var Order=require("./models/Ordered.js");

let productIds = "";
let userIds = "";
//......adding items to cart...............
app.post("/cart", function (req, res) {

    console.log(req.body);
      
      // productIds = productId;
       const cartItem = new Cart({
           userId: userIds,
           productName:  req.body.productName,
           productId: req.body.productId,
           Amount: req.body.Amount,
           gst:req.body.gst
       });
   
   
   
   
       Cart.find({userId: userIds,productId: req.body.productId},function(err,data){
           if(err){
            res.json({success:false,err:err})
               
           }else{
               if(data.length === 0){
                   console.log("nodata");
                   cartItem.save(function (err) {
                       if (err) {
                        res.json({success:false,err:err})
                       } else {
                           //res.send("added to cart")
                          
                           res.json({success:true});
                       }
                   });               
               }else{
                   console.log(data);
                   res.json({
                       message:"Item already added to cart"
                   });
               }
           }
       });
   
    //   cartItem.save();
    //   res.redirect("/cart");
   });
   
   app.get("/cart", function (req, res) {
   
       Cart.find({userId:userIds},function(err,cartItems){
           if(err){
               console.log(err);
           }else{
               if(cartItems.length === 0){
                res.json({
                    message:"empty array"
                });
               }
               else{
                console.log(cartItems);
                let totalPrice=0;
                let gstTotalPrice=0;
                cartItems.forEach(function(product){
                     totalPrice=totalPrice+product.Amount;
                     gstTotalPrice=gstTotalPrice+(product.Amount* product.gst)/100
                     
                 });
 
                 res.json({
                     
                    message:"Cart Items and Total Price",
                    cartItems:cartItems,
                    totalPrice:totalPrice

                    });
           
               }
             
           }
       });
      
   
   
   });
   

//.........   addresss storing ...................

// app.post("/address",function(req,res){
// console.log("this is address body"+req.body);

// res.redirect("/address");
// });

app.get("/prevAddress", function (req, res) {
    if (userIds === "" ) {
        res.redirect("/");
    }
    else
     {
        let u = userIds;
        Address.find({ userId: u }, function (err, addressData) {
            if (err) {
                console.log(err);

            } else {
                console.log(addressData);
                res.json({
                     
                    message:"Previous address details",
                    productIds: productIds,
                    userIds: userIds,
                    addressData: addressData[0]

                    });

                console.log(userIds);
                console.log(productIds);
            }

        });
    }
});

//saving address details to db................................................
app.post("/addressDetails", function (req, res) {
    //console.log(req.body);
    let cmpy = req.body.company;
    const address = new Address({
        userId: req.body.userId,
        //productId: req.body.productId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        company: cmpy,
        email: req.body.email,
        phone: req.body.phone,
        country: req.body.country,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        address: req.body.address,
    });

    address.save(function(err){
        if(err){
            res.json({success:false,err:err});
        }
        else{
            res.json({success:true});
        }
    });
});
//...............delivery type.......................................................

app.post("/deliveryMethod", function (req, res) {
        let a;
        let type = req.body.radio;
        if (type === "freeDelivery") {
            a = 0;
        } else if (type === "standardDelivery") {
            a = 7;
        } else {
            a = 29;
        }
        const d = new deliveryType({
            userId: userIds,
            productId: productIds,
            type: type,
            amount: a
         });
        d.save(function (err) {
            if (err) {
                res.json({success:false,err:err});
            }
            else {
                res.json({success:true});
            }
        });
        console.log(req.body);
});

//....billing.................................................................
app.get("/billing", function (req, res) {

    console.log(userIds);
        console.log(productIds);

        Cart.find({ userId: userIds}, function (err, cartProducts) {
            if (err) {
                console.log(err);

            } else {
                let totalPrice=0;
               let gstTotalPrice=0;
                cartProducts.forEach(function(product){
                    totalPrice=totalPrice+product.Amount;
                    gstTotalPrice=gstTotalPrice+(product.Amount* product.gst)/100
                    
                });
                
                console.log("product details" + cartProducts);
                deliveryType.find({ userId: userIds}, function (err, deliveryDetailsArr) {
                    if (err) {
                        console.log(err);
                    } else {

                        Address.find({ userId: userIds}, function (err, addressDetailsArr) {
                            if (err) {
                                console.log(err);

                            } else {
                                res.json({ 
                                    message:"total billing details",
                                        addressDetailsArr: addressDetailsArr[addressDetailsArr.length-1],
                                        cartProducts: cartProducts,
                                        deliveryDetailsArr: deliveryDetailsArr[deliveryDetailsArr.length-1],
                                        totalPrice:totalPrice,
                                        gstTotalPrice:gstTotalPrice
                                     });
                         
                               
                            }
                        });
                    }
                });
            }
        });
    
});

app.post("/billing", function (req, res) {
console.log(req.body);
var orderId=req.body.orderId;

Cart.find({ userId: userIds}, function (err, cartProducts) {
    if (err) {
        console.log(err);

    } else {
        let cartProductIds=[];
        let totalPrice=0;
       let gstTotalPrice=0;
        cartProducts.forEach(function(product){
            cartProductIds.push(product.productId);
            totalPrice=totalPrice+product.Amount;
            gstTotalPrice=gstTotalPrice+(product.Amount* product.gst)/100
            
        });
        
        console.log("product details" + cartProducts);
        deliveryType.find({ userId: userIds}, function (err, deliveryDetailsArr) {
            if (err) {
                console.log(err);
            } else {

                Address.find({ userId: userIds}, function (err, addressDetailsArr) {
                    if (err) {
                        console.log(err);

                    } else {
                        var length=addressDetailsArr.length-1;
                 const newOrder= new Order({

                    userId: userIds,
                    productIds:cartProductIds,
                    address:{
                        firstName: addressDetailsArr[length].firstName,
                        lastName: addressDetailsArr[length].lastName,
                        middleName: addressDetailsArr[length].middleName,
                        company: addressDetailsArr[length].company,
                        email: addressDetailsArr[length].email,
                        phone: addressDetailsArr[length].phone,
                        country: addressDetailsArr[length].country,
                        city: addressDetailsArr[length].city,
                        state: addressDetailsArr[length].state,
                        postalCode: addressDetailsArr[length].postalCode,
                        address: addressDetailsArr[length].address,
                    },
                    deliveryType:{
                    type: "standardDelivery",
                    amount:7,
                    },
                    isDelivered:false,
                    isPaid:false
                });

        
                    newOrder.save(function(err){
                        if(err){
                            res.json({ 
                               err:err,
                                success:false
                                  
                                 });
                        }else{
                            res.json({ 
                                message:"the order is saved",
                                success:true
                                  
                                 });
                        }
                    
                    });





                       
                    }
                });
            }
        });
    }
});








   // res.redirect("/payment");
});

//................payment..............................................
app.get("/payment", function (req, res) {
    res.render("payment");
});






app.listen(process.env.PORT ||3000, function () {
    console.log("server is running at 3000 port");

});