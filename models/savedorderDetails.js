const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema is a structure of the documents(data).(i.e meta data)
const orderDetailsSchema = new Schema({
  email: String,
  pickupLocation: String,
  dropoffLocation: String,
  expectedDateOfDelivery: Date,
  goodsType: String,
  goodsweight: Number,
  goodsSize: String,
  vehicalSize: Number,
  vehicalBodyType: String,
  paymentMode: String,
  paymentStatus: String,
  paymentVia: String,
  orderStatus: String,
  orderDate: Date,
  orderTime: String,
});

// Model is a class with which we construct documents. CURD operations beacome easy to perform
// Collection creation is done by MODEL
const OrderDetailsModel = mongoose.model(
  "OrderDetail", // Deafult "s" is added to the name of colletion
  orderDetailsSchema //Struture of added document
);

module.exports = OrderDetailsModel;
