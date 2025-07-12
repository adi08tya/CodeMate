const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.middleware.js");
const connectionRequest = require("../models/connetionRequest.model.js");

userRouter.get("/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName" , "age" , "photoUrl" , "skills"]);

    res.json({
      message: "Connection requests fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error fetching requests: " + error.message);
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
   try {
    const loggedInUser = req.user;
    const connections = await connectionRequest.find({
        $or:[
            {fromUserId:loggedInUser._id,status:"accepted"},
            {toUserId:loggedInUser._id,status:"accepted"}
        ]
    })
    .populate("fromUserId", ["firstName", "lastName" , "age" , "photoUrl" , "skills"])
    .populate("toUserId", ["firstName", "lastName" , "age" , "photoUrl" , "skills"]);

    const data = connections.map((connection) => {
        if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
            return connection.toUserId;
        }
        return connection.fromUserId;
    })

    res.json({
      message: "Connections fetched successfully",
      data: data,})
   } catch (error) {
    res.status(400).send("Error fetching connections: " + error.message);
   }
})

module.exports = userRouter;
