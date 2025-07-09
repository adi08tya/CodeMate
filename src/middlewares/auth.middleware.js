const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const userAuth = async (req, res, next) => {
  try {
    // read the token from req cookies
    const cookies = req.cookies;
    const { token } = cookies;
    const decodedObj = await jwt.verify(token, process.env.jwtprivatekey);
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    res.status(401).send("Unauthorized access: " + error.message);
  }
};

module.exports = {
  userAuth,
};
