require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

var sha256 = require("js-sha256"); // For Encryption
const mongoose = require("mongoose"); // For Database

const DB =
  "mongodb+srv://therohansharma3:<password>@dev.vbq2sov.mongodb.net/test";

mongoose
  .connect(DB)
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log("no connection"));

const app = express();
app.use(cors());
let items;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
