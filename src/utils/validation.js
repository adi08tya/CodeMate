const validator  = require("validator");
const validateSignUpdata = (req)=>{
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName){
        throw new Error("First name and last name are required");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
}

const validateEditProfile = (req)=>{
  const allowedEditFields = ["firstName","lastName","photoUrl","about","skills" ]
  const isEditAllowed = Object.keys(req.body).every(field=>allowedEditFields.includes(field));
  return isEditAllowed;
}

module.exports = {
  validateSignUpdata,
  validateEditProfile,
};