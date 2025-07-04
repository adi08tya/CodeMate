const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth.middleware.js");
const app = express();


app.get("/getuserdata", userAuth, (req, res) => {
   try {
    throw new Error("Error in getuserdata route");
    res.send("User data fetched successfully");
   } catch (error) {
    res.status(500).send("Something went wrong");
   }
 
});
// app.use("/",(err, req, res, next) => {
//   if(err) {
//     //log your error to a file or monitoring service
//     res.status(500).send("Server Error");
//   }
// });


app.listen(3000, () => {
  console.log("server is successfully listening to port number 3000");
});
