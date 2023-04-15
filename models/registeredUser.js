const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema is a structure of the documents(data).(i.e meta data)
const registeredUserSchema = new Schema({
  fullName: String,
  companyName: String,
  email: { type: String, unique: true },
  phoneNumber: { type: String, unique: true },
  companyAddress: String,
  password: String,
  aboutCompany: String,
});

// Model is a class with which we construct documents. CURD operations beacome easy to perform
// Collection creation is done by MODEL
const RegistredUserModel = mongoose.model(
  "RegistredUser", // Deafult "s" is added to the name of colletion
  registeredUserSchema //Struture of added document
);

module.exports = RegistredUserModel;
