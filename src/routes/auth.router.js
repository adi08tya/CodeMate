const express = require("express");
const User = require("../models/user.model");
const authRouter = express.Router();
const { validateSignUpdata } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  // Dynamically create a new user based on the request body
  try {
    // validation of data
    validateSignUpdata(req);

    // encrypting the password
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: hashPassword,
      age: req.body.age,
      gender: req.body.gender,
    });
    await user.save();
    res.send("User created succesfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Enter a valid email Id");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid credentials");
    // const isPasswordValid = await bcrypt.compare(password,user.password)
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // Generate a JWT token
      const token = await user.getJWT();
      res.cookie("token", token);
      res.status(200).send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
  }
});


authRouter.post("/logout",async(req,res)=>{
   res.cookie("token",null,{
    expires: new Date(Date.now()),
   })
   res.send("User logged out successfully");
})


module.exports = authRouter;
