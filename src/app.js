const express = require("express");
const connectDB = require("./Config/database.js");
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
// get user by email
app.get("/user",async(req,res)=>{
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({emailId:userEmail})
    if (user.length === 0) {
      return res.status(404).send("User not found");
    }
    else{
      res.send(user);
    }
  } catch (error) {
    res.status(500).send("Error fetching user: " + error.message);
  }
})
// feed api - GET/feed - get all the users from the database
app.get("/feed", async(req,res)=>{
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
     res.status(400).send("something went wrong")
  }
})

// delete a user by id
app.delete("/user",async(req,res)=>{
  const userId = req.body._id
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("something went wrong");
  }
})

// Update the data of the user 
app.patch("/user",async(req,res)=>{
    const  userId = req.body.userId;
    const data =  req.body;
    console.log(data);
    
    try {
      await User.findByIdAndUpdate({_id:userId},data);
      res.send("User updated successfully")
    } catch (error) {
       res.status(400).send("something went wrong");
    }

})







connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(3000, () => {
      console.log("server is successfully listening to port number 3000");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
