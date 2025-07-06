const express = require("express");
const connectDB = require("./Config/database.js");
const { adminAuth, userAuth } = require("./middlewares/auth.middleware.js");
const app = express();
app.use(express.json());
const User = require("./models/user.js");
app.post("/signup", async (req, res) => {
  // Dynamically create a new user based on the request body
   const user = new User(req.body)
  try {
    await user.save();
    res.send("User created succesfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(3000, () => {
      console.log("server is successfully listening to port number 3000");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
