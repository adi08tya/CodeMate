const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect(process.env.mongoURI);
}

module.exports = connectDB;