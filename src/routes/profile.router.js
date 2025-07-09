const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.middleware.js");
const { validateEditProfile } = require("../utils/validation.js");
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

module.exports = profileRouter;
