const express = require("express");
const connectDB = require("./Config/database.js");
const validator = require("validator");
const validateSignUpdata = require("./utils/validation.js");
const bcrypt = require("bcrypt")
const app = express();
app.use(express.json());
const User = require("./models/user.js");
app.post("/signup", async (req, res) => {
 // Dynamically create a new user based on the request body
  try {
    // validation of data
    validateSignUpdata(req);

    // encrypting the password 
    const {password} =  req.body;
    const hashPassword = await bcrypt.hash(password,10)
    console.log(hashPassword);
    
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: hashPassword, 
      age: req.body.age,
      gender:req.body.gender,
    });
    await user.save();
    res.send("User created succesfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});

app.post("/login",async(req,res)=>{
  try {
    const {emailId,password} = req.body;
    if(!validator.isEmail(emailId)){
      throw new Error("Enter a valid email Id")
    } 
    const user = await User.findOne({emailId: emailId})
    if(!user) throw new Error("Invalid credentials");
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
      throw new Error ("Invalid credentials");
    }else{
    res.status(200).send("User logged in successfully");
    }
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
  }
})

// get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send("Error fetching user: " + error.message);
  }
});


// feed api - GET/feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

// delete a user by id
app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});


// Update the data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  console.log(data);

//  API level validation
  const ALLOWED_UPDATES = ["firstName", "lastName", "password","skills"];

  const isUpdateAllowed = Object.keys(data).every((k) => {
    return ALLOWED_UPDATES.includes(k);
  });

  try {
    if (!isUpdateAllowed) {
      throw new Error("Updates is not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {runValidators: true});
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
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
