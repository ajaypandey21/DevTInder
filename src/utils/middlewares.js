const userAuth = (req, res, next) => {
  console.log("in user MiddleWare");
  const token = "abcUser";
  const authenticatedUser = "abcUser" === token;
  if (!authenticatedUser) {
    res.status(401).send("Unauthorzied");
  } else {
    next();
  }
};
const adminAuth = (req, res, next) => {
  console.log("in admin MiddleWare");
  const token = "abcAadmin";
  const authenticatedUser = "abcAdmin" === token;
  if (!authenticatedUser) {
    res.status(401).send("Unauthorzied");
  } else {
    next();
  }
};

module.exports = { userAuth, adminAuth };
