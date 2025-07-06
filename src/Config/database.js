const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://adityaparashar966:3ejI8IrjCGQTLqBb@cluster0.akmtak7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async()=>{
    await mongoose.connect(mongoURI);
}

module.exports = connectDB;