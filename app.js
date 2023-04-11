const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const RegisteredUser = require("./models/registeredUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
bodyParser = require("body-parser");
const url =
  "mongodb+srv://therohansharma3:Gq0rJmKip6wV2RYn@dev.vbq2sov.mongodb.net/FreightEZ?retryWrites=true&w=majority";

// salt to make things more secure
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecure = "kjqnfburr3iqefbewifbw";
// use to parse json
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// // parse application/json
// app.use(bodyParser.json());
// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// app.use(
//   cors({
//     // credentials: true,
//     // app can able to communicate with it (client) i.e what kind of app can commnicate with our a.
//     origin: "*",
//   })
// );

mongoose
  .connect(url)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log("no connection"));

const con = mongoose.connection;
con.on("open", () => {
  console.log("connected...");
});

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  console.log("POST /register");
  console.log(req.body);
  const {
    fullName,
    companyName,
    email,
    phoneNumber,
    companyAddress,
    password,
  } = req.body; // Update destructuring assignment

  // try catch use to avoid duplicate email address.
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt); // Hash the password
    const registeredUser = new RegisteredUser({
      fullName,
      companyName,
      email,
      phoneNumber,
      companyAddress,
      password: hashedPassword, // Set hashed password
    });

    const savedUser = await registeredUser.save(); // Save the user to the database
    console.log(savedUser);
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(422).json(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log("POST /login");
    console.log(req.body);
    const { email, password } = req.body;
    const registeredUser = await RegisteredUser.findOne({ email });
    if (registeredUser) {
      const passwordOk = bcrypt.compareSync(password, registeredUser.password);
      if (passwordOk) {
        jwt.sign(
          { email: registeredUser.email, id: registeredUser._id },
          jwtSecure,
          {},
          (err, token) => {
            if (err) {
              throw err;
            } else {
              res.cookie("token", token).json("pass ok");
            }
          }
        );
      } else {
        res.status(422).json("Login failed, password not matched");
      }
    } else {
      // throw err;
      res.json("user not found");
    }
  } catch (error) {
    console.log(error, error.message);
  }
});
app.listen(4000, () => {
  console.log("Server started at port 4000");
});
