const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema is a structure of the documents(data).(i.e meta data)
const orderDetailsSchema = new Schema({
  email: String,
  pickupLocation: String,
  dropoffLocation: String,
  dateForPickup: Date,
  goodsType: String,
  goodsWeight: Number,
  goodsSize: String,
  vehicalSize: Number,
  vehicalBodyType: String,
  distanceKm: Number,
  isCargoInsured: Boolean,
  paymentMode: String,
  paymentVia: String,
  paymentStatus: String,
  orderDate: String,
  orderTime: String,
  orderStatus: String,
});

// Model is a className with which we construct documents. CURD operations beacome easy to perform
// Collection creation is done by MODEL
const OrderDetailsModel = mongoose.model(
  "OrderDetail", // Deafult "s" is added to the name of colletion
  orderDetailsSchema //Struture of added document
);

module.exports = OrderDetailsModel;
