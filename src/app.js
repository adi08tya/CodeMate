const express = require("express");
const connectDB = require("./Config/database.js");
const cookieparser = require("cookie-parser");
const cors = require("cors")
require("dotenv").config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true
  })
);
app.use(express.json());
app.use(cookieparser());

const authRouter = require("./routes/auth.router.js");
const requestRouter = require("./routes/request.router.js");
const profileRouter = require("./routes/profile.router.js");
const userRouter = require("./routes/user.router.js");

app.use("/auth",authRouter);
app.use("/request",requestRouter);
app.use("/profile",profileRouter);
app.use("/user",userRouter);



connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(3000, () => {
      console.log("server is successfully listening to port number 3000");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
