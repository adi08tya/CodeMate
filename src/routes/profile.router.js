const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.middleware.js");
const { validateEditProfile } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error in profile Api: " + error.message);
  }
});
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach(key=> loggedInUser[key]=req.body[key]);
    console.log(loggedInUser);
    await loggedInUser.save();
    res.json({
        "message":`${loggedInUser.firstName}'s details updated successfully`,
        "data":loggedInUser
    });
    
  } catch (error) {
    res.status(400).send("Error in profile edit:" + error)
  }
});

profileRouter.patch("/password", userAuth,async(req,res)=>{
   try {
      const loggedInUser = req.user;
      console.log(loggedInUser);
      console.log(req.body.password + "" + req.body.newPassword);
      
      
      if(!req.body.password || !req.body.newPassword){
        throw new Error("Enter both current and new Password");
      }
      const isCurrentPasswordValid = await loggedInUser.validatePassword(req.body.password);
      console.log(isCurrentPasswordValid);
      
      if(!isCurrentPasswordValid){
        throw new Error("Current Password is not correct");
      }
      
      const hashPassword = await bcrypt.hash(req.body.newPassword , 10);
      console.log(hashPassword);
      
      loggedInUser.password = hashPassword;
      await loggedInUser.save();
      
      res.json({
        message:"Password is successfully changed",
      })
   } catch (error) {
       res.status(400).send("Error" + error);
   }
})

module.exports = profileRouter;
