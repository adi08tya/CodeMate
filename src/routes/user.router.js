const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.middleware.js");
const connectionRequest = require("../models/connetionRequest.model.js");
const User = require("../models/user.model.js");

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



userRouter.get("/feed",userAuth,async(req,res)=>{
  try {
    // User should see all the user cards except
    // his own card
    // his connections
    // ignored people
    // already sent the connection request

    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; 
    const skip = (page-1)*limit;
    const connectionRequests = await connectionRequest.find({
      $or:[
        {fromUserId:loggedInUser._id},
        {toUserId:loggedInUser._id},
      ]
    }).select(["fromUserId","toUserId"])

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((request)=>{
       hideUsersFromFeed.add(request.fromUserId.toString());
       hideUsersFromFeed.add(request.toUserId.toString());
    })

    const users = await User.find({
      $and:[
        {_id:{ $nin:Array.from(hideUsersFromFeed)}},
        {_id:{$ne:loggedInUser._id}},
      ]
    }).select(["firstName", "lastName", "age", "photoUrl", "skills"])
      .skip(skip)
      .limit(limit)
  
    console.log(users.length);
    
    res.send(users);

  } catch (error) {
    res.status(400).json({message: "Error fetching feed: " + error.message,})
  }
})

module.exports = userRouter;
