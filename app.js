const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const RegisteredUser = require("./models/registeredUser");
const OrderDetail = require("./models/savedorderDetails");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieparser = require("cookie-parser");
bodyParser = require("body-parser");
const url =
  "mongodb+srv://therohansharma3:Gq0rJmKip6wV2RYn@dev.vbq2sov.mongodb.net/FreightEZ?retryWrites=true&w=majority";

// salt to make things more secure
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecure = "kjqnfburr3iqefbewifbw";
// use to parse json
const app = express();
app.use(cookieparser());
app.use(
  cors({
    // origin: "http://192.168.1.8:8080",
    origin: "http://localhost:5173",
    // origin: "http://localhost:4173",
    // origin: [
    //   "http://localhost:5173",
    //   "http://localhost:8080",
    //   "http:192.168.188.230:8080",
    // ],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());

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
  // res.header("Access-Control-Allow-Origin", "http://192.168.1.8:8080");
  // res.header("Access-Control-Allow-Headers", "http://192.168.1.8:8080");
  // res.header("Access-Control-Allow-Credentials", "true");
  console.log("POST /register");

  const {
    fullName,
    companyName,
    aboutCompany,
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
      aboutCompany,
      email,
      phoneNumber,
      companyAddress,
      password: hashedPassword, // Set hashed password
    });

    const savedUser = await registeredUser.save(); // Save the user to the database
    console.log(savedUser);
    res.status(200).json("Registred Succesfully! please login to continue");
  } catch (err) {
    res.status(422).json("user already exit");
  }
});

app.post("/login", async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "http://192.168.1.8:8080");
  // res.header("Access-Control-Allow-Headers", "http://192.168.1.8:8080");
  // res.header("Access-Control-Allow-Credentials", "true");
  try {
    console.log("POST /login");

    const { email, password } = req.body;
    console.log("POST /login", req.body);
    const registeredUser = await RegisteredUser.findOne({ email });
    console.log("POST /login", registeredUser);
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
              res.cookie("token", token).json("logged in successfully");
            }
          }
        );
      } else {
        res.status(422).json("Login failed, password not matched");
      }
      console.log("Done");
    } else {
      // throw err;
      res.json("user not found");
    }
  } catch (error) {
    console.log(error, error.message);
  }
});

// app.get("/profile", (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   const cookie = req.cookies;
//   const token = cookie.token;
//   console.log(token);
//   if (token) {
//     jwt.verify(token, jwtSecure, {}, async (err, userData) => {
//       if (err) {
//         res.status(401).json("Invalid token");
//       } else {
//         const {
//           fullName,
//           companyName,
//           aboutCompany,
//           email,
//           phoneNumber,
//           companyAddress,
//         } = await RegisteredUser.findById(userData.id);
//         res.json({
//           fullName,
//           companyName,
//           aboutCompany,
//           email,
//           phoneNumber,
//           companyAddress,
//         });
//       }
//     });
//   }
// });

app.post("/orderDetails", async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  try {
    // Extract the order data from the request body
    const orderData = req.body;

    // Create a new order document in the database
    const order = await OrderDetail.create(orderData);

    // Return the created order as a response
    res.status(201).json(order);
  } catch (error) {
    // Handle any error that occurs while creating the order
    console.error("Failed to create order:", error);
    // Return a 500 status code with an error message
    res.status(500).json({ message: "Failed to create order" });
  }
});

app.post("/getPendingOrderDetails", async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // Extract the email from request body
  const { email } = req.body;

  try {
    // Find order details for the given email in the database
    const orderDetails = await OrderDetail.find({
      email,
      orderStatus: "Pending",
    });

    if (orderDetails.length > 0) {
      // Return the order details as a response
      res.status(200).json(orderDetails);
    } else {
      // Return a 404 status code with an appropriate message if no orders are found
      res.status(404).json({ message: "No orders found for the given email" });
    }
  } catch (error) {
    // Handle any error that occurs while fetching order details
    console.error(error);
    // Return a 500 status code with an error message
    res.status(500).json({ message: "Failed to fetch order details" });
  }
});
app.post("/getPreviousOrderDetails", async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // Extract the email from request body
  const { email } = req.body;

  try {
    // Find order details for the given email in the database
    const orderDetails = await OrderDetail.find({
      email,
      orderStatus: "Completed",
    });

    if (orderDetails.length > 0) {
      // Return the order details as a response
      res.status(200).json(orderDetails);
    } else {
      // Return a 404 status code with an appropriate message if no orders are found
      res.status(404).json({ message: "No orders found" });
    }
  } catch (error) {
    // Handle any error that occurs while fetching order details
    console.error(error);
    // Return a 500 status code with an error message
    res.status(500).json({ message: "Failed to fetch order details" });
  }
});

// DELETE route to delete an order by ID
app.delete("/order/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Find the order by ID and remove it
    const deletedOrder = await OrderDetail.findByIdAndRemove(orderId);

    if (deletedOrder) {
      // If order found and deleted, return success response
      return res.status(200).json({ message: "Order deleted successfully" });
    } else {
      // If order not found, return error response
      return res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    // If error occurred, return error response
    return res.status(500).json({ message: "Failed to delete order", error });
  }
});

app.post("/getOngoingOrderDetails", async (req, res) => {
  // Extract the email from request body
  const { email } = req.body;

  try {
    // Find order details for the given email in the database
    const orderDetails = await OrderDetail.find({
      email,
      orderStatus: "Ongoing",
    });

    if (orderDetails.length > 0) {
      // Return the order details as a response
      res.status(200).json(orderDetails);
    } else {
      // Return a 404 status code with an appropriate message if no orders are found
      res.status(404).json({ message: "No orders found for the given email" });
    }
  } catch (error) {
    // Handle any error that occurs while fetching order details
    console.error(error);
    // Return a 500 status code with an error message
    res.status(500).json({ message: "Failed to fetch order details" });
  }
});

app.post("/getProfileDetail", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  const profile = await RegisteredUser.findOne({ email }, { password: 0 }); // Exclude password field from the query
  if (profile) {
    res.status(200).json(profile);
  } else {
    res.status(422).json("Profile not found");
  }
});

// Define PUT route for updating profile details
app.put("/updateProfileDetail/:email", async (req, res) => {
  try {
    // Extract the email from request parameters
    const email = req.params.email;

    // Extract the updated data from request body
    const { fullName, companyName, phoneNumber, companyAddress, aboutCompany } =
      req.body;

    // Perform the update operation using the provided data
    const update = await RegisteredUser.findOneAndUpdate(
      { email }, // Find user by email
      {
        fullName,
        companyName,
        phoneNumber,
        companyAddress,
        aboutCompany,
      }, // Update the fields with provided data
      { new: true } // Return the updated user object
    );

    if (update) {
      // If update is successful, send response with updated user object
      res.status(200).json("Profile successfully updated");
    } else {
      // If user not found, send response with error message
      res.status(422).json({ error: "Profile not found" });
    }
  } catch (error) {
    // Handle any errors that may occur during the update operation
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(4000, () => {
  console.log("Server started at port 4000");
});
