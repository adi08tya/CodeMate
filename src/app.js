const express = require("express");
const connectDB = require("./Config/database.js")
const { adminAuth, userAuth } = require("./middlewares/auth.middleware.js");
const app = express();
const User = require("./models/user.js");
app.post("/signup",async(req,res)=>{
    // Creating a new instance of user model
    const user = new User({
      firstName: "Adi",
      lastName: "Parashar",
      emailId: "Aditya@parashar.com",
      password: "123456",
      age: 22,
      gender: "Male",
    });
    try {
      await user.save();
      res.send("User created succesfully");
    } catch (error) {
      res.status(400).send("Error creating user: " + error.message);
    }
});

connectDB()
  .then(() =>{console.log("MongoDB connected successfully")
    app.listen(3000, () => {
      console.log("server is successfully listening to port number 3000");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
