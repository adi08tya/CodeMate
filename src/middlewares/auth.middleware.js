const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminValid = token === "xyz";
  if (!isAdminValid) res.status(401).send("unauthorized request");
  else next();
};

const userAuth = (req,res,next) => {
    const token = "abc";
    const isUserValid = token === "ac";
    if (!isUserValid) res.status(401).send("unauthorized request"); 
    else next();
};  

module.exports = {
  adminAuth,
  userAuth,
};