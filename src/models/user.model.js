const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,   //unique: true then mongoDB will create index autmatically on this query
      lowercase: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Email is not valid :" + value);
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Password is not strong enough");
        }
      }
    },
    age: {
      type: Number,
      min:18
    },
    gender: {
      type: String,
      // validate(value){
      //   if(!['Male','Female','Other'].includes(value)) throw new Error("Gender data is not valid");
      // }
      enum:{
        values:['Male','Female','Other'],
        message:`{VALUE} is not a valid status`
      }
    },
    photoUrl:{
        type: String
    },
    about:{
        type:String,
        default:"This is a default about section."
    },
    skills:{
        type:[String],
    }
  },
  { timestamps: true }
);

// userSchema.index({firstName:1,lastName:1});


userSchema.methods.getJWT = async function(){
    const token = await jwt.sign({_id:this._id},process.env.jwtprivatekey, {expiresIn: "1d"});
    return token;
}
userSchema.methods.validatePassword= async function(passwordInputByUser){
  const hashPassword = this.password;
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, hashPassword);
  return isPasswordValid;
}


const User = mongoose.model("User", userSchema);
module.exports = User;
