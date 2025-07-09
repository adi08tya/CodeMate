const express = require("express");
const connectDB = require("./Config/database.js");
const validator = require("validator");
const validateSignUpdata = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/user.model.js");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cookieparser());

const authRouter = require("./routes/auth.router.js");
const requestRouter = require("./routes/request.router.js");
const profileRouter = require("./routes/profile.router.js");

app.use("/auth",authRouter);
app.use("/request",requestRouter);
app.use("/profile",profileRouter);



connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(3000, () => {
      console.log("server is successfully listening to port number 3000");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
