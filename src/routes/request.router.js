const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.middleware.js");
const ConnectionRequest = require("../models/connetionRequest.model.js");
const User = require("../models/user.model.js");

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
      const fromUserId =  req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const  toUser = await User.findById(toUserId);
      if(!toUser){
        return res.status(400).json({message:"User doesnot exist"})
      }
      const allowedStatus = ["ignored","interested"];
      if(!allowedStatus.includes(status)){
         return res.status(400).json({ message: `Invalid status type : ${status}` });
      }

      // check if there is an existing connectionRequest
       const existingConnectionRequest = await ConnectionRequest.findOne({
        $or : [
        {fromUserId:fromUserId ,toUserId:toUserId},
        {fromUserId:toUserId ,toUserId:fromUserId}
        ]
      })
      
      if(existingConnectionRequest){
        return res
          .status(400)
          .json({ message: `Request already exists` });
      }

      const request  = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
      })
     
      const requestData = await request.save();

      res.json({
        message:req.user.firstName + " " + req.user.lastName + " " + status+ " " + toUser.firstName + " " + toUser.lastName,
        requestData,
      })

  } catch (error) {
    res.status(400).send("Error sending connection request: " + error.message);
  }
});

requestRouter.post("/review/:status/:requestId",userAuth,async(req,res)=>{
  try {
    const loggedInUser = req.user;
    const {status,requestId} = req.params;
    const allowedStatus = ["accepted","rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({ message: `Invalid status type : ${req.params.status}` });
    }
    
    const connectionRequest = await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status: "interested"
    })

    if(!connectionRequest){
      return res.status(400).json({ message: "Connection request not found " });
    }    
    connectionRequest.status = status;
    await connectionRequest.save();
    res.json({
      message: `Connection request ${status} successfully`,
    })
    
  } catch (error) {
     res.status(400).send("error reviewing connection request: " + error.message);
  }
})


module.exports = requestRouter;
