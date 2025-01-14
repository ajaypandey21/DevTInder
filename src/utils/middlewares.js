const UserModel = require("../models/user.model");
var jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    } else {
      const decodedObj = await jwt.verify(token, "JwtSecretKey1234", {
        expiresIn: "1h",
      });
      const user = await UserModel.findById(decodedObj.id);
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = { userAuth };
