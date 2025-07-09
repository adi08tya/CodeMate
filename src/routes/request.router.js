const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.middleware.js");

requestRouter.post("/sendrequest", userAuth, async (req, res) => {
  try {
    console.log("Inside sendConnectionRequest API");
    res.send(
      "Connection request sent successfully by " +
        req.user.firstName +
        " " +
        req.user.lastName
    );
  } catch (error) {
    res.status(400).send("Error sending connection request: " + error.message);
  }
});

// get user by email
// requestRouter.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const user = await User.find({ emailId: userEmail });
//     if (user.length === 0) {
//       return res.status(404).send("User not found");
//     } else {
//       res.send(user);
//     }
//   } catch (error) {
//     res.status(500).send("Error fetching user: " + error.message);
//   }
// });

// feed api - GET/feed - get all the users from the database
requestRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

module.exports = requestRouter;
