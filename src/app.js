
const express = require("express");

const app = express();


// request handler
app.use("/test",(req,res)=>{
    res.send("your test marks will be displayed here");
    
})
app.use("/",(req,res)=>{
    res.send("namaste from the server!")
})

app.listen(3000,()=>{
    console.log("server is succesfully listening on 3000");
    
});