const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth.middleware.js");
const app = express();

// app.use("/user", [
//   (req, res, next) => {
//     // next();
//     res.send("route handler");
//   },
//   (req, res) => {
//     res.send("route handler 2");
//   },
// ]);

// middleware
app.use("/admin", adminAuth);

app.post("/user/login",(req,res) => {
  res.send("user logged in successfully");
});

app.get("/user", userAuth, (req, res) => {
  res.send("User data sent successfully");
});

app.get("/admin/getalldata", (req, res) => {
  res.send("Alldatasent");
});

app.get("/admin/deleteuser", (req, res) => {
  res.send("deleted user");
});

app.post("/post", (req, res) => {
  res.send("postcall");
});

app.delete("/delete", (req, res) => {
  res.send("deleted successfully");
});

app.listen(3000, () => {
  console.log("server is successfully listening to port number 3000");
});
